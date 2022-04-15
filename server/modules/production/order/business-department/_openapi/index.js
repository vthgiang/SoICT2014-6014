const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderBusinessDepartmentRoute = {
    "/business-department": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get all business department",
            "operationId": "getBusinessDepartment",
            "parameters": [
                {
                    "in": "query",
                    "name": "role",
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
                    "description": "get_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_failed",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.ORDER],
            "description": "create business department",
            "operationId": "createBusinessDepartment",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin business department",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/BusinessDepartment"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/BusinessDepartment"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "create_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/BusinessDepartment"}
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
    "/business-department/{businessDepartmentId}": {
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "Update a business department",
            "operationId": "UpdateBusinessDepartment",
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
                "description": "Nhập thông tin business department",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/BusinessDepartment"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/BusinessDepartment"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "edit_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/BusinessDepartment"}
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

module.exports = openapi_orderBusinessDepartmentRoute;
