const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminPrivilege ={
    "/privileges":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get Priveleges",
            "operationId": "getPriveleges",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[],
            "responses": {
                "200": {
                },
                "400": {
                }
            }
        },
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Privelege ",
            "operationId": "createPrivelege",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [ ],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                },
                "400": {
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/privileges/{id}":{
        "get": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get Privelege by id",
            "operationId": "GetPrivelegeById",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "responses": {
                "200": {
                },
                "400": {
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Edit Privelege By ID",
            "operationId": "editPrivelege",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                },
                "400": {
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Delete Privelege by ID",
            "operationId": "deletePrivelege",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "responses": {
                "200": {
                },
                "400": {
                }
            }
        }
    },
}

module.exports = openapi_superAdminPrivilege;