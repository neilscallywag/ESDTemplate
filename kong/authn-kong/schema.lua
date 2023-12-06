return {
    name = "authn-kong",
    fields = {
        { config = {
            type = "record",
            fields = {
                { jwt_secret = { type = "string", required = true } },
                { refresh_endpoint = { type = "string", required = true } },
                { unauthenticated_endpoints = { type = "array", default = {}, elements = { type = "string" } } },
                { role_access_rules = { 
                    type = "map", 
                    keys = { type = "string" }, 
                    values = { type = "array", elements = { type = "string" } } 
                }},
            },
        }},
    },
  }