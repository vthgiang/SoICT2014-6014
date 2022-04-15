const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderBankAccountRoute = {
    "/bank-account": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get all back accounts",
            "operationId": "getOrderBankAccount",
            "parameters": [
                {
                    "in": "query",
                    "name": "account",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "bankName",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "bankAcronym",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "page",
                    "schema": {
                        "type": "integer"
                    },
                },
                {
                    "in": "query",
                    "name": "limit",
                    "schema": {
                        "type": "integer"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "get_all_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_all_failed",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.ORDER],
            "description": "create back accounts",
            "operationId": "createOrderBankAccount",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin bank account",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/BankAccount"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/BankAccount"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "create_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/BankAccount"}
                        }
                    }
                },
                "400": {
                    "description": "create_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/bank-account/{bankAccountId}": {
            "patch": {
                "tags": [apiTagNames.ORDER],
                "description": "Update a bank account",
                "operationId": "UpdateBankAccount",
                "parameters": [
                    {
                        "in": "path",
                        "name": "id",
                        "schema": {
                            "type": "string"
                        },
                        "require": true
                    },
                ],
                "requestBody": {
                    "description": "Nhập thông tin công việc",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#components/schemas/BankAccount"}
                        },
                        "application/xml": {
                            "schema": {"$ref": "#components/schemas/BankAccount"}
                        },
                        "required": true
                    }
                },
                "responses": {
                    "200": {
                        "description": "edit_successfully",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/BankAccount"}
                            }
                        }
                    },
                    "400": {
                        "description": "edit_failed",
                        "content": {}
                    }
                },
                "x-codegen-request-body-name": "body"
            }
        }
}

module.exports = openapi_orderBankAccountRoute;
