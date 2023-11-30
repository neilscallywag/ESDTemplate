local typedefs = require "kong.db.schema.typedefs"

return {
  name = "authn-kong",
  fields = {
    { consumer = typedefs.no_consumer },
    {
      config = {
        type = "record",
        fields = {
            -- the default_secret needs to be changed with actual secret. 
            -- preferabbly populated using a env or vault manager
            -- to discuss
          { jwt_secret = { type = "string", required = true, default = "default_secret" }, },
        },
      },
    },
  },
}
