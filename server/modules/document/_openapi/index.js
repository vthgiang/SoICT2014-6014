const apiTagNames = require("../../../api-docs/apiTagName");

const openapi_documentRoute = {
    "/documents/documents": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Get all Document",
            "operationId": "getDocuments",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                    "description": "get_documents_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "integer",
                                    "format": "int32"
                                },
                                "$ref": "#/components/schemas/Document"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_documents_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Create a new Document",
            "operationId": "CreateDocument",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "description": "Nhập thông tin tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Document"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/Document"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_document_success"
                },
                "400": {
                    "description": "create_document_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/documents/documents/{id}": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Find document by ID",
            "description": "Lấy thông tin tài liệu theo id",
            "operationId": "getDocumentById",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id của document cần tìm",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "Lấy thông tin tài liệu thành công",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Document"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/Document"
                            }
                        }
                    }
                },
                "400": {
                    "description": "Id tài liệu không hợp lệ",
                    "content": {}
                }
            }
        },
        "delete": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Delete document by ID",
            "description": "Xóa thông tin tài liệu theo id",
            "operationId": "deleteDocument",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài liệu cần xóa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_document_success"
                },
                "400": {
                    "description": "delete_document_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Update document by ID",
            "description": "Cập nhật thông tin tài liệu theo id",
            "operationId": "updateDocument",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id tài liệu cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Document"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/Document"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_document_success"
                },
                "400": {
                    "description": "edit_document_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/documents/documents/import-file": {
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "import file document",
            "operationId": "importFileDocument",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "properties": {
                                "file": {
                                    "type": "string",
                                    "description": "file to import",
                                    "format": "base64"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "import_document_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Document"
                            }
                        }
                    }
                },
                "400": {
                    "description": "import_document_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/documents/user-statistical": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "user statistical",
            "operationId": "user-statistical",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                },
                {
                    "in": "query",
                    "name": "option",
                    "description": "Chọn các option: downloaded, common, latest ",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "get_document_user_statistical_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_document_user_statistical_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-domains": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Get all document-domains",
            "operationId": "getDocumentsDomains",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                    "description": "get_document_domains_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentDomain"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentDomain"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_documents_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Create a new document-domains",
            "operationId": "CreateDocumentDomains",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "description": "Nhập thông tin danh mục tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentDomain"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentDomain"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_document_domain_success"
                },
                "400": {
                    "description": "create_document_domain_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/documents/document-domains/{id}": {
        "patch": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Update document-domains by ID",
            "description": "Cập nhật thông tin danh mục tài liệu theo id",
            "operationId": "updateDocumentDomains",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id danh mục tài liệu cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin danh mục tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentDomain"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentDomain"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_document_domain_success"
                },
                "400": {
                    "description": "edit_document_domain_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Delete document-domains by ID",
            "description": "Xóa thông tin danh mục tài liệu theo id",
            "operationId": "deleteDocumentDomains",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id danh mục tài liệu cần xóa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_document_domains_success"
                },
                "400": {
                    "description": "delete_document_domains_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-domains/import-file": {
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "import file document domains",
            "operationId": "importFileDocumentDomains",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "properties": {
                                "file": {
                                    "type": "string",
                                    "description": "file to import",
                                    "format": "base64"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "import_document_domain_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentDomain"
                            }
                        }
                    }
                },
                "400": {
                    "description": "import_document_domain_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-categories": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Get all document categories",
            "operationId": "getDocumentCategories",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                    "description": "get_document_categories_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentCategory"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentCategory"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_document_categories_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Create a new document category",
            "operationId": "CreateDocumentCategory",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "description": "Nhập thông tin loại tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        },
                        "example": {
                            "name": "Công văn",
                            "description": "Công văn"
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
                    "description": "create_document_category_success"
                },
                "400": {
                    "description": "create_document_category_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/documents/document-categories/{id}": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Find document category by ID",
            "description": "Lấy thông tin loại tài liệu theo id",
            "operationId": "getDocumentCategoryById",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id của loại tài liệu cần tìm",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
            ],
            "responses": {
                "200": {
                    "description": "get_document_category_success",
                    "content": {
                        "application/xml": {
                            "schema": {
                                "type": "object"
                            }
                        },
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_document_category_faile",
                    "content": {}
                }
            }
        },
        "patch": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Update document category by ID",
            "description": "Cập nhật thông tin loại tài liệu theo id",
            "operationId": "updateDocumentCategory",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id loại tài liệu cần cập nhật",
                    "schema": {
                        "type": "string"
                    },
                    "required": true
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin loại tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        },
                        "example": {
                            "name": "Công văn",
                            "description": "Công văn"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentCategory"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_document_category_success"
                },
                "400": {
                    "description": "edit_document_category_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Delete document category by ID",
            "description": "Xóa thông tin loại tài liệu theo id",
            "operationId": "deleteDocumentCategory",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id loại tài liệu cần xóa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_document_category_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentCategory"
                            }
                        }
                    }
                },
                "400": {
                    "description": "delete_document_category_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-categories/import-file": {
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "import file document category",
            "operationId": "importFileDocumentcategory",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "properties": {
                                "file": {
                                    "type": "string",
                                    "description": "file to import",
                                    "format": "base64"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "import_document_category_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            },
                            "example": {
                                "name": "Công văn",
                                "description": "Công văn"
                            }
                        }
                    }
                },
                "400": {
                    "description": "import_document_category_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-archives": {
        "get": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Get all DocumnetArchives",
            "operationId": "getDocumnetArchives",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
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
                    "description": "get_document_archives_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentArchive"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentArchive"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_document_archives_faile",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Create a new document archive ",
            "operationId": "CreateDocumentArchive",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "description": "Nhập thông tin lưu trữ tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentArchive"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentArchive"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_document_archive_success"
                },
                "400": {
                    "description": "create_document_archive_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/documents/document-archives/{id}": {
        "patch": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Update document archive by ID",
            "description": "Cập nhật thông tin lưu trữ tài liệu",
            "operationId": "updateDocumentArchive",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "schema": {
                        "type": "string"
                    },
                    "required": true
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin nơi lưu trữ tài liệu",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentArchive"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "$ref": "#/components/schemas/DocumentArchive"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_document_archive_success"
                },
                "400": {
                    "description": "edit_document_archive_faile",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "Delete document archive by ID",
            "description": "Xóa thông tin lưu trữ tài liệu",
            "operationId": "deleteDocumentArchive",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id lưu trữ tài liệu cần xóa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_document_archive_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentArchive"
                            }
                        },
                        "application/xml": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentArchive"
                            }
                        }
                    }
                },
                "400": {
                    "description": "delete_document_archive_faile",
                    "content": {}
                }
            }
        }
    },
    "/documents/document-archives/import-file": {
        "post": {
            "tags": [apiTagNames.DOCUMENT],
            "description": "import file document archive",
            "operationId": "importFileDocumentArchive",
            "security": [{ ApiKeyAuth: [] }],
            "parameters": [
            ],
            "requestBody": {
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "properties": {
                                "file": {
                                    "type": "string",
                                    "description": "file to import",
                                    "format": "base64"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "import_document_archive_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/DocumentArchive"
                            }
                        }
                    }
                },
                "400": {
                    "description": "import_document_archive_faile",
                    "content": {}
                }
            }
        }
    },
}

module.exports = openapi_documentRoute;