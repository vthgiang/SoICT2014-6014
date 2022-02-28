const apiTagNames = require("../../../../api-docs/apiTagName");

const openapi_assetManagementRoute = {
    "/asset/assets": {
        "get": {
            "tags": [apiTagNames.ASSET],
            "description": "Get all Asset",
            "operationId": "getAsset",
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
                    "description": "get_list_asset_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_list_asset_false",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.ASSET],
            "description": "Create a new Asset",
            "operationId": "CreateAsset",
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
                "description": "Nhập thông tin tài sản",
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
                    "description": "create_asset_success"
                },
                "400": {
                    "description": "create_asset_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/asset/assets/{id}": {
        "patch": {
            "tags": [apiTagNames.ASSET],
            "description": "Update Asset by ID",
            "description": "Cập nhật thông tin tài sản",
            "operationId": "updateAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần cập nhật",
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
                "description": "Nhập thông tin tài sản",
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
                    "description": "edit_asset_success"
                },
                "400": {
                    "description": "create_asset_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.ASSET],
            "description": "Delete Asset ",
            "description": "Xóa thông tin tài sản",
            "operationId": "deleteAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần xóa",
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
                    "description": "delete_asset_success"
                },
                "400": {
                    "description": "delete_asset_false",
                    "content": {}
                }
            }
        }
    },
    "/asset/assets/{id}/usage-logs": {
        "post": {
            "tags": [apiTagNames.ASSET],
            "description": "Create a new Asset",
            "operationId": "CreateAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần thêm thông tin sử dụng",
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
                "description": "Nhập thông tin sử dụng tài sản",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_usage_success"
                },
                "400": {
                    "description": "create_usage_false",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "patch": {
            "tags": [apiTagNames.ASSET],
            "description": "Update usage Asset by ID",
            "description": "Cập nhật thông tin sử dụng tài sản",
            "operationId": "updateUsageAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần cập nhật",
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
                "description": "Nhập thông tin sử dụng tài sản",
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
                    "description": "edit_usage_success"
                },
                "400": {
                    "description": "edit_usage_false",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.ASSET],
            "description": "Delete usage Asset ",
            "description": "Xóa thông tin sử dụng tài sản",
            "operationId": "deleteAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần xóa",
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
                    "description": "delete_usage_success"
                },
                "400": {
                    "description": "delete_usage_false",
                    "content": {}
                }
            }
        }
    },
    "/asset/assets/:id/maintainance-logs": {
        "post": {
            "tags": [apiTagNames.ASSET],
            "description": "Create a new maintainance Asset",
            "operationId": "CreateMaintainanceAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần thêm thông tin bảo trì",
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
                "description": "Nhập thông tin bảo trì tài sản",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_maintainance_success"
                },
                "400": {
                    "description": "create_maintainance_false",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "patch": {
            "tags": [apiTagNames.ASSET],
            "description": "Update maintainance Asset by ID",
            "description": "Cập nhật thông tin sử dụng tài sản",
            "operationId": "updateMaintainanceAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần cập nhật",
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
                "description": "Nhập thông tin bảo trì tài sản",
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
                    "description": "edit_maintainance_success"
                },
                "400": {
                    "description": "edit_maintainance_false",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.ASSET],
            "description": "Delete maintainance Asset ",
            "description": "Xóa thông tin bảo trì tài sản",
            "operationId": "deleteMaintainanceAsset",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài sản cần xóa",
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
                    "description": "delete_maintainance_success"
                },
                "400": {
                    "description": "delete_maintainance_false",
                    "content": {}
                }
            }
        }
    },
    "/assets/maintainance-logs": {
        "get": {
            "tags": [apiTagNames.ASSET],
            "description": "Get all maintainance Asset",
            "operationId": "getMaintainanceAsset",
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
                    "description": "get_list_asset_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_list_asset_false",
                    "content": {}
                }
            }
        }
    },
    "/asset/assets/incident-logs": {
        "get": {
            "tags": [apiTagNames.ASSET],
            "description": "Get all incident-logs Asset",
            "operationId": "getIncidentAsset",
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
                    "description": "get_incidents_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_incidents_false",
                    "content": {}
                }
            }
        }
    },
}

module.exports = openapi_assetManagementRoute;