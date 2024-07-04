const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_superAdminSystem ={
    "/backup":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get backup list",
            "operationId": "GetBackupList",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "potal", 
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                  "description": "get_backup_list_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_backup_list_failure",
                  "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Back Up",
            "operationId": "CreateBackUp",
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
                    "description": "create_backup_success"
                },
                "400": {
                    "description": "create_backup_failure",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/backup/config":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get config back up",
            "operationId": "getConfigBackup",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "potal", 
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                  "description": "get_config_backup_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "get_config_backup_success",
                  "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Config Backup",
            "operationId": "configBackup",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                    "description": "config_backup_success"
                },
                "400": {
                    "description": "config_backup_failure",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/backup/download":{
        "get":{
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Get links of 1 company",
            "operationId": "getSuperAminLink",
            "security": [{ ApiKeyAuth: [] }],
            "parameters":[
                {
                    "in": "query",
                    "name": "path", 
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                  "description": "download_backup_success",
                  "content": {
                    "application/json": {
                      "schemtypea": {
                        "type": "object"
                      }
                    }
                  }
                },
                "400": {
                  "description": "download_backup_failure",
                  "content": {}
                }
            }
        },
    },
    "/backup/{version}/edit":{
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Edit Back Up Info",
            "description": "editBackupInfo",
            "operationId": "updateLink",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "version",
                    "in": "path",
                    "description": "Nhập version cần chỉnh sửa",
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
                    "description": "edit_backup_info_success"
                },
                "400": {
                    "description": "edit_backup_info_failure",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/backup/{version}":{
        "delete": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Delete Back Up ",
            "operationId": "deleteBackUp",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "version",
                    "in": "path",
                    "description": "Nhập version",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_backup_success"
                },
                "400": {
                    "description": "delete_backup_failure",
                    "content": {}
                }
            }
        }
    },
    "/restore/{version}":{
        "patch": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Back up restore",
            "operationId": "BackUpRestore",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập version cần restore",
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
                    "description": "restore_data_success"
                },
                "400": {
                    "description": "restore_data_failure",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/backup/upload":{
        "post": {
            "tags": [apiTagNames.SUPER_ADMIN],
            "description": "Create Links",
            "operationId": "CreateLinks",
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
                    "description": "get_backup_list_success"
                },
                "400": {
                    "description": "get_backup_list_failure",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
}

module.exports = openapi_superAdminSystem;