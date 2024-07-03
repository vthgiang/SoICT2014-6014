const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminLink ={
    "/links":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get links of 1 company",
            "operationId": "getSuperAminLink",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
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
                  "description": "get_links_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_links_faile",
                  "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Links",
            "operationId": "CreateLinks",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [ ],
            "requestBody": {
                "description": "Nhập Url",
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
                    "description": "create_link_success"
                },
                "400": {
                    "description": "create_link_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/links/{id}":{
        "get": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get link information by id",
            "operationId": "getLinkInformationById",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id link",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "show_link_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "show_link_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Update link by ID",
            "description": "Chỉnh sửa link theo ID",
            "operationId": "updateLink",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id link cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin link",
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
                    "description": "edit_link_success"
                },
                "400": {
                    "description": "edit_link_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Delete link ",
            "description": "Xóa thông tin link",
            "operationId": "deleteLink",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id link",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_link_success"
                },
                "400": {
                    "description": "delete_link_faile",
                    "content": {}
                }
            }
        }
    },
    "/links/company/update":{
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Update Company Links",
            "description": "Cập nhật thông tin links của công ty",
            "operationId": "updateCompanyLinks",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin cập nhật",
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
                    "description": "update_company_links_success"
                },
                "400": {
                    "description": "update_company_links_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    }
}

module.exports = openapi_superAdminLink;