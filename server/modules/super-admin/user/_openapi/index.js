const openapi_user = {
    "/user/users": {
        "get": {
            "tags": [
                "User"
            ],
            "description": "Get all user",
            "operationId": "getUser",
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
                    "description": "get_users_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_users_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [
                "User"
            ],
            "description": "Create a new User",
            "operationId": "CreateUser",
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
                "description": "Nhập thông tin người dùng",
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
                    "description": "create_user_success"
                },
                "400": {
                    "description": "create_user_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/user/users/{id}": {
        "get": {
            "tags": [
                "User"
            ],
            "description": "Get user by id",
            "operationId": "getUserById",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id người dùng",
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
                    "description": "show_user_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "show_user_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [
                "User"
            ],
            "description": "Update User by ID",
            "description": "Cập nhật thông tin người dùng",
            "operationId": "updateUser",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id người dùng cần cập nhật",
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
                "description": "Nhập thông tin người dùng",
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
                    "description": "edit_user_success"
                },
                "400": {
                    "description": "edit_user_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [
                "User"
            ],
            "description": "Delete User ",
            "description": "Xóa thông tin người dùng",
            "operationId": "deleteUser",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id người dùng cần xóa",
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
                    "description": "delete_user_success"
                },
                "400": {
                    "description": "delete_user_faile",
                    "content": {}
                }
            }
        }
    },
}

module.exports = openapi_user;