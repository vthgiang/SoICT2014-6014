const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_categoryRoute = {
    "/categories": {
        "get": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Get all categories",
            "description": "Get all categories",
            "operationId": "getCategories",
            "parameters": [
                {
                    "name": "type",
                    "in": "query",
                    "description": "Type of category",
                    "required": false,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "name",
                    "in": "query",
                    "description": "Name of category",
                    "required": false,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "page",
                    "in": "query",
                    "description": "Page number",
                    "required": false,
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "limit",
                    "in": "query",
                    "description": "Number of items per page",
                    "required": false,
                    "schema": {
                        "type": "integer"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "id": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
            }
        }   
    },
    "/categories/category-tree": {
        "get": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Get all categories",
            "description": "Get all categories",
            "operationId": "getCategoryToTree",
            "parameters": [
            ],
            "responses": {
                "200": {
                    "description": "get_category_to_tree_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_category_to_tree_fail",
                    "content": {}
                }
            }
        }
    },

    "/categories/by-type": {
        "get": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Get all categories by type",
            "description": "Get all categories by type",
            "operationId": "getCategoriesByType",
            "parameters": [
                {
                    "name": "type",
                    "in": "query",
                    "description": "Type of category",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "page",
                    "in": "query",
                    "description": "Page number",
                    "required": false,
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "limit",
                    "in": "query",
                    "description": "Number of items per page",
                    "required": false,
                    "schema": {
                        "type": "integer"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    },
    "/categories" : {
        "post": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Create new category",
            "description": "Create new category",
            "operationId": "createCategory",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "description": "Category object",
                    "required": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "parentId": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    },
    "/categories/{id}": {
        "patch": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Update category",
            "description": "Update category",
            "operationId": "updateCategory",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Category id",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "body",
                    "in": "body",
                    "description": "Category object",
                    "required": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "parentId": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                        }
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    },
    "/categories/{id}": {
        "delete": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Delete category",
            "description": "Delete category",
            "operationId": "deleteCategory",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Category id",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    },
    "/categories/delete-many": {
        "post": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Delete many categories",
            "description": "Delete many categories",
            "operationId": "deleteManyCategories",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "description": "Category object",
                    "required": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "ids": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    },
    "/categories/imports": {
        "post": {
            "tags": [apiTagNames.CATEGORY],
            "security": [{ ApiKeyAuth: [] }],
            "summary": "Import categories",
            "description": "Import categories",
            "operationId": "importCategories",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "description": "Category object",
                    "required": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "file": {
                                "type": "string"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request",
                    "content": {}
                }
            }
        }
    }
}
module.exports = openapi_categoryRoute;
