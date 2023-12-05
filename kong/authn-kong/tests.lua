local helpers = require "spec.helpers"
local cjson = require "cjson"
local jwt = require "resty.jwt"

local function generateToken(payload, secret, expiresIn)
    payload.exp = ngx.time() + expiresIn
    return jwt:sign(secret, { header = {typ = "JWT", alg = "HS256"}, payload = payload })
end

local secret = "KUKUBIRDAIDHAIDHAJKSDAJIDBQIheh09u2jeqinwdjnbqwsdifhnw0euq2e0nqwdo"

describe("MyAuthHandler Plugin", function()
    setup(function()
        helpers.start_kong({ custom_plugins = "authn-kong", })
    end)

    teardown(function()
        helpers.stop_kong()
    end)
end)

describe("Unauthenticated Endpoints", function()
  it("allows access to unauthenticated endpoint without cookies", function()
      local response = helpers.proxy_client():get("/one/ping")
      assert.response(response).has.status(200)
  end)

  it("allows access to unauthenticated endpoint with invalid cookies", function()
    local client = helpers.proxy_client()
    local refreshToken = generateToken({ user = "example" }, secret, 300)
    client:set_cookie("access_token=" .. refreshToken) 
    local response = client:get("/one/ping")
    assert.response(response).has.status(200)
  end)

end)

describe("Cookie Handling", function()
  it("handles malformed cookies correctly", function()
      local client = helpers.proxy_client()
      client:set_cookie("access_token=;malformed_token;")
      local response = client:get("/three/ping")
      assert.response(response).has.status(400) 
  end)
end)


describe("Access Token Validation", function()
  it("denies access with an expired access token", function()
      local client = helpers.proxy_client()
      client:set_cookie("access_token=expired_token")
      local response = client:get("/three/ping")
      assert.response(response).has.status(401)
  end)

  it("denies access with an invalid access token", function()
      local client = helpers.proxy_client()
      client:set_cookie("access_token=invalid_token")
      local response = client:get("/three/ping")
      assert.response(response).has.status(401)
  end)

  it("denies access without an access token", function()
      local response = helpers.proxy_client():get("/three/ping")
      assert.response(response).has.status(401)
  end)
end)

describe("Refresh Token Handling", function()
  it("refreshes the token when access token is expired", function()
    local client = helpers.proxy_client()
    local accessToken = generateToken({ user = "example" }, secret, -300)  -- Expired access token
    local refreshToken = generateToken({ user = "example" }, secret, 300)  -- Valid refresh token
    client:set_cookie("access_token=" .. accessToken)  
    client:set_cookie("refresh_token=" .. refreshToken) 
    local response = client:get("/three/ping")
    assert.response(response).has.status(200)
  end)


  it("fails to refresh the token with an invalid refresh token", function()
      local client = helpers.proxy_client()
      client:set_cookie("access_token=expired_token")
      client:set_cookie("refresh_token=invalid_refresh_token")
      local response = client:get("/three/ping")
      assert.response(response).has.status(401)
  end)
end)

describe("Access Token Refresh", function()
  it("attempts to refresh access token when the current one is invalid", function()
    local client = helpers.proxy_client()
    local accessToken = generateToken({ user = "example" }, secret, -300)  -- Invalid access token
    local refreshToken = generateToken({ user = "example" }, secret, 300)  -- Valid refresh token
    client:set_cookie("access_token=" .. accessToken)  
    client:set_cookie("refresh_token=" .. refreshToken)  
    local response = client:get("/three/ping")
    assert.response(response).has.status(200)
  end)
end)
