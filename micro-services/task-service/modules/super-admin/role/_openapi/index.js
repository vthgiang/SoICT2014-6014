const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminRole ={
    "/roles":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Lấy danh sách tất cả các role của 1 công ty",
            "operationId": "getSuperAminRole",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "roleID", 
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "type", 
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
                  "description": "get_roles_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_roles_faile",
                  "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Role",
            "operationId": "CreateRole",
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
                    "description": "create_role_success"
                },
                "400": {
                    "description": "create_role_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/roles/imports":{
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Role Imports",
            "operationId": "RoleImports",
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
                    "description": "import_role_success"
                },
                "400": {
                    "description": "import_role_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/roles/{id}":{
        "get": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get Role by ID",
            "operationId": "GetRolebyID",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "show_role_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "show_role_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Edit Role by ID",
            "operationId": "editRole",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id role cần chỉnh sửa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
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
                    "description": "edit_role_success"
                },
                "400": {
                    "description": "edit_role_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Delete role by ID ",
            "operationId": "deleteRole",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id role",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_role_success"
                },
                "400": {
                    "description": "delete_role_failes",
                    "content": {}
                }
            }
        }
    },
}

module.exports = openapi_superAdminRole;