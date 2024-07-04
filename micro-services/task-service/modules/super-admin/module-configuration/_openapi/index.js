const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminModule ={
    "/configurations":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Lấy thông tin cấu hình module quản lý nhân sự",
            "operationId": "getsuperAdminModule",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "poral", 
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                  "description": "get_configuration_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_configuration_faile",
                  "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Chỉnh sửa thông tin cấu hình module quản lý nhân sự",
            "operationId": "updateSuperAdminModule",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin cấu hình module quản lý nhân sự",
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
                    "description": "edit_configuration_success"
                },
                "400": {
                    "description": "edit_configuration_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    }
}

module.exports = openapi_superAdminModule;