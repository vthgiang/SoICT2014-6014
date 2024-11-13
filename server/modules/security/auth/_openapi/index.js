const openapi_authorizationRoute = {
    "/authorization/check": {
        "post": {
            "tags": ["Authorization"],
            "security": [{ "ApiKeyAuth": [] }],
            "summary": "Check entity authorization on object",
            "description": "Check if an entity has permission to perform a specified action on an object.",
            "operationId": "checkAuthorization",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "entityId": {
                                    "type": "string",
                                    "description": "The ID of the entity (e.g., a user or service) requesting authorization.",
                                    "example": "67337f05259beb64cc51dec6"
                                },
                                "objectId": {
                                    "type": "string",
                                    "description": "The ID of the object to which access is being requested.",
                                    "example": "67337f05259beb64cc51deda"
                                },
                                "action": {
                                    "type": "string",
                                    "description": "The action the entity wants to perform on the object.",
                                    "example": "set_sale_target"
                                }
                            },
                            "required": ["entityId", "objectId", "action"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Authorization check successful.",
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
                                        "example": ["check_authorization_success"]
                                    },
                                    "content": {
                                        "type": "boolean",
                                        "description": "Result of the authorization check; true if the action is allowed, false otherwise.",
                                        "example": true
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

module.exports = openapi_authorizationRoute;
