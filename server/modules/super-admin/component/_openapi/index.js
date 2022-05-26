const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_componentRoute = {
    "/component/components": {
        "post": {
            "tags": [apiTagNames.COMPONENT],
            "description": "create new component",
            "operationId": "createComponent",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "links": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "deleteSoft": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
}
module.exports = openapi_componentRoute;
