const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminComponent ={
    "/components":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get list of components of 1 company",
            "operationId": "getSuperAminComponent",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "page", 
                    "schema": {
                        "type": "interger"
                    },
                },
                {
                    "in": "query",
                    "name": "limit",
                    "schema": {
                      "type": "integer"
                    },
                },
                {
                    "in": "query",
                    "name": "currenntRole",
                    "schema": {
                      "type": "string"
                    }
                },
                {
                    "in": "query",
                    "name": "linkId",
                    "schema": {
                      "type": "Schema.Types.ObjectId"
                    }
                },
                {
                    "in": "query",
                    "name": "type",
                    "schema": {
                      "type": "String"
                    }
                } 
            ],
            "responses": {
                "200": {
                  "description": "get_components_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_components_faile",
                  "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Component",
            "operationId": "CreateComponent",
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
                    "description": "create_component_success"
                },
                "400": {
                    "description": "create_component_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/components/{id}":{
        "get": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get link information by id",
            "operationId": "getLinkInformationById",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id component",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "show_component_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "show_component_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Update component by ID",
            "description": "Chỉnh sửa thành phần theo ID",
            "operationId": "updateComponent",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id thành phần cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin component",
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
                    "description": "edit_component_success"
                },
                "400": {
                    "description": "edit_component_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Delete Component ",
            "operationId": "deleteComponent",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id component",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_component_success"
                },
                "400": {
                    "description": "delete_component_faile",
                    "content": {}
                }
            }
        }
    },
    "/components/company/update":{
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Update Company Component",
            "operationId": "updateCompanyComponent",
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
                    "description": "update_company_components_success"
                },
                "400": {
                    "description": "update_company_components_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    }
}

module.exports = openapi_superAdminComponent;