const apiTagNames = require("../../../../api-docs/apiTagName");

const openapi_organizationalUnit = {
    "/organizational-units/organizational-units": {
        "get": {
            "tags": [apiTagNames.ORGANIZATIONAL],
            "description": "Get all organizational",
            "operationId": "getOrganizational",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "query",
                    "name": "page",
                    "schema": {
                        "type": "integer"
                    }
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
                    "description": "get_departments_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_departments_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.ORGANIZATIONAL],
            "description": "Create a new organizational",
            "operationId": "CreateOrganizational",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
            ],
            "requestBody": {
                "description": "Nhập thông tin đơn vị",
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
                    "description": "create_department_success"
                },
                "400": {
                    "description": "create_department_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/organizational-units/organizational-units/{id}": {
        "get": {
            "tags": [apiTagNames.ORGANIZATIONAL],
            "description": "Get organizational by id",
            "operationId": "getOrganizationalById",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id đơn vị",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
            ],
            "responses": {
                "200": {
                    "description": "show_department_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "show_department_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.ORGANIZATIONAL],
            "description": "Update organizational by ID",
            "description": "Cập nhật thông tin đơn vị",
            "operationId": "updateOrganizational",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id đơn vị cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
            ],
            "requestBody": {
                "description": "Nhập thông tin đơn vị",
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
                    "description": "edit_department_success"
                },
                "400": {
                    "description": "edit_department_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.ORGANIZATIONAL],
            "description": "Delete organizational ",
            "description": "Xóa thông tin đơn vị",
            "operationId": "deleteOrganizational",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id đơn vị",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
            ],
            "responses": {
                "200": {
                    "description": "delete_department_success"
                },
                "400": {
                    "description": "delete_department_faile",
                    "content": {}
                }
            }
        }
    }
}

module.exports = openapi_organizationalUnit;