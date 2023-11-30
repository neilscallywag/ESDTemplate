local BasePlugin = require "kong.plugins.base_plugin"
local jwt = require "resty.jwt"
local redis = require "resty.redis"
local kong = kong

local MyAuthHandler = BasePlugin:extend()

MyAuthHandler.PRIORITY = 1000
MyAuthHandler.VERSION = "1.0.0"

function MyAuthHandler:new()
  MyAuthHandler.super.new(self, "authn-kong")
end

local function extractTokenFromCookie(cookie, tokenName)
  if not cookie then
    return nil
  end

  local tokenPattern = tokenName .. "=([^;]+)"
  local token = cookie:match(tokenPattern)
  return token
end

local function checkTokenInRedis(token, conf)
  local red = redis:new()
  red:set_timeout(conf.redis_timeout) -- Redis connection timeout

  -- likely will throw error because no password is provided no is there any username
  local ok, err = red:connect(conf.redis_host, conf.redis_port)
  if not ok then
    kong.log.err("Failed to connect to Redis: ", err)
    return false
  end

  local res, err = red:get(token)
  if not res then
    kong.log.err("Failed to retrieve token from Redis: ", err)
    return false
  end

  -- Close Redis connection
  local ok, err = red:set_keepalive(10000, 100) -- 10 sec idle timeout, 100 connections pool
  if not ok then
    kong.log.err("Failed to set Redis keepalive: ", err)
  end

  return res ~= ngx.null
end

function MyAuthHandler:access(conf)
  MyAuthHandler.super.access(self)

  local cookie = kong.request.get_header("Cookie")
  local token = extractTokenFromCookie(cookie, "access_token")

  if not token or not checkTokenInRedis(token, conf) then
    return kong.response.exit(302, {}, {["Location"] = "/client/login"})
  end

  -- Validate token and get payload
  local jwtToken = jwt:verify(conf.jwt_secret, token)
  if not jwtToken.verified then
    return kong.response.exit(302, {}, {["Location"] = "/client/login"})
  end

  local userID = jwtToken.payload.userID
  local userRole = jwtToken.payload.userRole

  kong.service.request.set_header("UserID", userID)
  kong.service.request.set_header("UserRole", userRole)
  kong.service.request.set_header("Authorization", "Bearer " .. token)
end

return MyAuthHandler
