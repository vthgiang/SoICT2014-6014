const openapi_logRoute = {
    "/log/authorization": {
        "get": {
            "tags": ["AuthorizationLog"],
            "security": [{ "ApiKeyAuth": [] }],
            "summary": "Get authorization logs",
            "description": "Retrieve authorization logs detailing access attempts and outcomes.",
            "operationId": "getAuthorizationLogs",
            "responses": {
                "200": {
                    "description": "Successfully retrieved authorization logs.",
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
                                        "example": ["get_authorization_logs_success"]
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
                                                            "example": "67338d3050f98d35d8abcc46"
                                                        },
                                                        "allow": {
                                                            "type": "string",
                                                            "example": "false"
                                                        },
                                                        "type": {
                                                            "type": "string",
                                                            "example": "mixed"
                                                        },
                                                        "entity": {
                                                            "type": "string",
                                                            "example": "67337f05259beb64cc51dec6"
                                                        },
                                                        "object": {
                                                            "type": "string",
                                                            "example": "67337f05259beb64cc51deda"
                                                        },
                                                        "action": {
                                                            "type": "string",
                                                            "example": "read"
                                                        },
                                                        "policyApplied": {
                                                            "type": ["string", "null"],
                                                            "example": null
                                                        },
                                                        "ruleApplied": {
                                                            "type": ["string", "null"],
                                                            "example": null
                                                        },
                                                        "ipAddress": {
                                                            "type": "string",
                                                            "example": "::1"
                                                        },
                                                        "userAgent": {
                                                            "type": "string",
                                                            "example": "PostmanRuntime/7.42.0"
                                                        },
                                                        "accessTime": {
                                                            "type": "string",
                                                            "format": "date-time",
                                                            "example": "2024-11-12T17:15:28.268Z"
                                                        },
                                                        "createdAt": {
                                                            "type": "string",
                                                            "format": "date-time",
                                                            "example": "2024-11-12T17:15:28.270Z"
                                                        },
                                                        "updatedAt": {
                                                            "type": "string",
                                                            "format": "date-time",
                                                            "example": "2024-11-12T17:15:28.270Z"
                                                        },
                                                        "__v": {
                                                            "type": "integer",
                                                            "example": 0
                                                        }
                                                    }
                                                }
                                            },
                                            "totalLoggingRecords": {
                                                "type": "integer",
                                                "example": 2
                                            },
                                            "totalPages": {
                                                "type": "integer",
                                                "example": 1
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

module.exports = openapi_logRoute;
