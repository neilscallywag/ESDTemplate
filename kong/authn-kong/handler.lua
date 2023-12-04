-- Required libraries
local jwt = require "resty.jwt"
local cjson = require "cjson.safe"
local http = require "resty.http"
local ck = require "resty.cookie"

-- Plugin handler
local MyAuthHandler = {
    PRIORITY = 1000,
    VERSION = "1.0",
}

-- Function to check if the endpoint is unauthenticated
local function isUnauthenticatedEndpoint(path, unauthenticated_endpoints)
    for _, endpoint in ipairs(unauthenticated_endpoints) do
        if path == endpoint then
            return true
        end
    end
    return false
end

-- Function to validate the access token
local function validateAccessToken(token, jwt_secret)
    local validated_token = jwt:verify(jwt_secret, token)

    if validated_token.verified then
        return true, validated_token.payload, false
    else
        local is_expired = validated_token.reason == "jwt expired"
        kong.log.err("JWT validation failed: ", validated_token.reason)
        return false, nil, is_expired
    end
end

-- Function to forward claims as headers
local function forwardClaimsAsHeaders(claims)
    for k, v in pairs(claims) do
        kong.service.request.set_header("X-Claim-" .. k, v)
    end
end

-- Function to refresh the access token
local function refreshAccessToken(refreshToken, refresh_endpoint)
    local httpClient = http.new()
    httpClient:set_timeout(5000)

    local res, err = httpClient:request_uri(refresh_endpoint, {
        method = "POST",
        headers = {["Content-Type"] = "application/json"},
        body = cjson.encode({ refresh_token = refreshToken }),
    })

    if not res then
        kong.log.err("failed to request: ", err)
        return nil
    end

    if res.status ~= 200 then
        kong.log.err("failed to refresh token: ", res.body)
        return nil
    end

    local body = cjson.decode(res.body)
    return { claims = body.newAccessToken }
end

-- Access phase handler
function MyAuthHandler:access(conf)
    local path = kong.request.get_path()
    kong.log.notice("The path is ", path)

    local cookies, err = ck:new()
    if not cookies then
        return kong.response.exit(500, "Failed to create resty.cookie instance: " .. err)
    end

    local accessToken, err = cookies:get("access_token")
    local refreshToken, err = cookies:get("refresh_token")

    if isUnauthenticatedEndpoint(path, conf.unauthenticated_endpoints) and not accessToken then
        return
    end

    if not accessToken then
        return kong.response.exit(401, "No access token provided")
    end

    local isValid, claims, is_expired = validateAccessToken(accessToken, conf.jwt_secret)

    if isValid then
        forwardClaimsAsHeaders(claims)
    elseif is_expired then
        local newAccessToken = refreshAccessToken(refreshToken, conf.refresh_endpoint)
        if newAccessToken then
            forwardClaimsAsHeaders(newAccessToken.claims)
        else
            return kong.response.exit(401, "Invalid Tokens")
        end
    else
        return kong.response.exit(401, "Invalid access tokens")
    end
end

-- Return the handler
return MyAuthHandler
