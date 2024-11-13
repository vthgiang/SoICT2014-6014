const openapi_objectRoute = {
    "/object/objects-all": {
        "get": {
            "tags": ["Object"],
            "security": [{ "ApiKeyAuth": [] }],
            "summary": "Get all objects",
            "description": "Retrieve a list of all objects with their attributes and related entities.",
            "operationId": "getAllObjects",
            "responses": {
                "200": {
                    "description": "Successfully retrieved list of objects.",
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
                                        "example": ["get_all_objects_success"]
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
                                                            "example": "67337f05259beb64cc51ded2"
                                                        },
                                                        "name": {
                                                            "type": "string",
                                                            "example": "Sales Report"
                                                        },
                                                        "attributes": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "object",
                                                                "properties": {
                                                                    "_id": {
                                                                        "type": "string",
                                                                        "example": "67337f05259beb64cc51ded3"
                                                                    },
                                                                    "key": {
                                                                        "type": "string",
                                                                        "example": "type"
                                                                    },
                                                                    "value": {
                                                                        "type": "string",
                                                                        "example": "financial_report"
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "type": {
                                                            "type": "string",
                                                            "example": "Resource"
                                                        },
                                                        "relatedEntities": {
                                                            "type": "object",
                                                            "properties": {
                                                                "owner": {
                                                                    "type": "string",
                                                                    "example": "67337f05259beb64cc51decf"
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
module.exports = openapi_objectRoute;
