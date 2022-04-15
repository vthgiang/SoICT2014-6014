const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderTaxRoute = {
    "/tax": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get all taxes",
            "operationId": "getTaxes",
            "parameters": [
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "number"
                    },
                },
                {
                    "in": "query",
                    "name": "name",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
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
            "description": "create new tex",
            "operationId": "createNewTax",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin tax",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/Tax"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/Tax"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "create_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Tax"}
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
        "delete": {
            "tags": [apiTagNames.ORDER],
            "description": "delete tax",
            "operationId": "deleteTax",
            "parameters": [
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "delete_failed",
                    "content": {}
                }
            },
        },
    },
    "/tax/check-code": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "check available code",
            "operationId": "checkAvailableCode",
            "parameters": [
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "check_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "check_failed",
                    "content": {}
                }
            },
        },
    },
    "/tax/get-by-code": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get tax by code",
            "operationId": "getTaxByCode",
            "parameters": [
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "get_failed",
                    "content": {}
                }
            },
        },
    },
    "/tax/get-by-good-id": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get tax by good id",
            "operationId": "getTaxByGoodId",
            "parameters": [
                {
                    "in": "query",
                    "name": "goodId",
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "get_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "get_failed",
                    "content": {}
                }
            },
        },
    },
    "/tax/{taxId}": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get tax detail by id",
            "operationId": "getTaxDetail",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "get_failed",
                    "content": {}
                }
            },
        },
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "edit tax by code",
            "operationId": "editTax",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin Tax",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/Tax"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/Tax"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "edit_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Tax"}
                        }
                    }
                },
                "400": {
                    "description": "edit_failed",
                    "content": {}
                }
            },
        },

    },
    "/tax/disable/{id}": {
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "disable tax by id",
            "operationId": "disableTaxById",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "disable_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "disable_failed",
                    "content": {}
                }
            },
        },
    },
}

module.exports = openapi_orderTaxRoute;
