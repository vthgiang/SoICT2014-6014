const openapi_entityRoute = {
    "/entity/entities-all": {
        "get": {
            "tags": ["Entity"],
            "security": [{ "ApiKeyAuth": [] }],
            "summary": "Get all entities",
            "description": "Retrieve a list of all entities along with their attributes.",
            "operationId": "getAllEntities",
            "responses": {
                "200": {
                    "description": "Successfully retrieved list of entities.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": {
                                        "type": "boolean",
                                        "example": true
                                    },
                                    "messages": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        },
                                        "example": ["get_all_entities_success"]
                                    },
                                    "content": {
                                        "type": "object",
                                        "properties": {
                                            "data": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "id": {
                                                            "type": "string",
                                                            "example": "67337f05259beb64cc51dec6"
                                                        },
                                                        "name": {
                                                            "type": "string",
                                                            "example": "John Doe"
                                                        },
                                                        "attributes": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "object",
                                                                "properties": {
                                                                    "_id": {
                                                                        "type": "string",
                                                                        "example": "67337f05259beb64cc51dec7"
                                                                    },
                                                                    "key": {
                                                                        "type": "string",
                                                                        "example": "pos"
                                                                    },
                                                                    "value": {
                                                                        "type": "string",
                                                                        "example": "Sales Manager"
                                                                    },
                                                                    "dataType": {
                                                                        "type": "string",
                                                                        "example": "string"
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "type": {
                                                            "type": "string",
                                                            "example": "Human"
                                                        }
                                                    }
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
                                        "type": "string",
                                        "example": "Invalid request parameters"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = openapi_entityRoute;
