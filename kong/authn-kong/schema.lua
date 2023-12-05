return {
    name = "authn-kong",
    fields = {
        { config = {
            type = "record",
            fields = {
                -- ... [existing fields] ...
                { role_access_rules = { 
                    type = "map", 
                    keys = { type = "string" }, 
                    values = { type = "array", elements = { type = "string" } } 
                }},
            },
        }},
    },
  }