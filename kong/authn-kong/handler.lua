-- Required libraries
local jwt = require "resty.jwt"
local validators = require "resty.jwt-validators"
local cjson = require "cjson.safe"
local http = require "resty.http"
local ck = require "resty.cookie"

-- Plugin handler
local MyAuthHandler = {
    PRIORITY = 1000,
    VERSION = "1.0",
}

-- Setup the expiration validator
local claim_spec = {
    exp = validators.is_not_expired()
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

-- Function to verify and decode the token
local function verifyToken(jwt_secret, token)
    local verified_token = jwt:verify(jwt_secret, token, claim_spec)
    return verified_token
end

-- Function to validate the access token
local function validateAccessToken(token, jwt_secret)
    local validated_token = verifyToken(jwt_secret, token)

    if validated_token.verified then
        return true, validated_token.payload, false
    else
        local is_expired = validated_token.reason and string.find(validated_token.reason, "expired") ~= nil
        kong.log.notice("is_expired: ", is_expired)
        return false, nil, is_expired;
    end
end

-- Function to forward claims as headers
local function forwardClaimsAsHeaders(claims)
    if not claims then
        return
    end
    for k, v in pairs(claims) do
        kong.service.request.set_header("X-Claim-" .. k, v)
    end
end

-- Function to get the identity token and verify it
local function getAndVerifyIdentityToken(cookies, jwt_secret)
    local identityToken, err = cookies:get("identity_token")
    if not identityToken then
        kong.log.err("Identity token not found: ", err)
        return nil, "Identity token not found"
    end

    return verifyToken(jwt_secret, identityToken)
end

-- Function to check if the path is authorized for the user role
local function isPathAuthorizedForRole(path, userRole, roleAccessRules)
    local allowedPaths = roleAccessRules[userRole]
    if not allowedPaths then
        return false
    end

    for _, allowedPath in ipairs(allowedPaths) do
        if path == allowedPath then
            return true
        end
    end
    return false
end


-- Function to refresh the access token
local function refreshAccessToken(refreshToken, refresh_endpoint)
    kong.log.notice("Refreshing access token")
    local httpClient = http.new()
    httpClient:set_timeout(5000)

    local res, err = httpClient:request_uri(refresh_endpoint, {
        method = "POST",
        headers = {["Content-Type"] = "application/json"},
        body = cjson.encode({ refresh_token = refreshToken }),
    })

    kong.log.notice("Response from refresh endpoint: ", res.body)
    kong.log.notice("Error from refresh endpoint: ", err)
    
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
    -- Get and verify the identity token
    local verifiedIdentityToken, err = getAndVerifyIdentityToken(cookies, conf.jwt_secret)
    if err or not verifiedIdentityToken or not verifiedIdentityToken.verified then
        return kong.response.exit(401, "Invalid identity token")
    end

    -- Extract user role from claims
    local userRole = verifiedIdentityToken.payload.role
    if not userRole then
        return kong.response.exit(401, "User role not found in token")
    end

    -- Check if the path is authorized for the user role
    if not isPathAuthorizedForRole(path, userRole, conf.role_access_rules) then
        return kong.response.exit(403, "Unauthorized for this path")
    end

    local isValid, claims, is_expired = validateAccessToken(accessToken, conf.jwt_secret)

    if isValid then
        forwardClaimsAsHeaders(claims)
    elseif is_expired then
        local newAccessToken = refreshAccessToken(refreshToken, conf.refresh_endpoint)
        if newAccessToken then
            local verifiedToken = verifyToken(newAccessToken, conf.jwt_secret)
            forwardClaimsAsHeaders(verifiedToken.payload)
        else
            -- I am not sure if need to make a call to /logout endpoint to clear the cookies
            -- local res, err = httpClient:request_uri(/auth/logout, {
            --     method = "POST",
            --     headers = {["Content-Type"] = "application/json"},
            --     body = cjson.encode({ refresh_token = refreshToken }),
            -- })
            return kong.response.exit(401, "Likely Invalid Refresh Token")
        end
    else
        return kong.response.exit(401, "Invalid access tokens")
    end
end

-- Return the handler
return MyAuthHandler