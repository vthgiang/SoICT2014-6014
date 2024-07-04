const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminApi ={
    "/companies": {
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get a list of api of a company",
            "operationId": "getSuperAminApi",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "path", 
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "method",
                    "schema": {
                      "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "category",
                    "schema": {
                      "type": "string"
                    }
                },  
                {
                    "in": "query",
                    "name": "special",
                    "schema": {
                      "type": "string"
                    }
                } 
            ],
            "responses": {
                "200": {
                  "description": "get_apis_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get apis failure",
                  "content": {}
                }
            }
        }
    }
}

module.exports = openapi_superAdminApi;