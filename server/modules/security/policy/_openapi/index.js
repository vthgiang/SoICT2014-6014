const openapi_policyRoute = {
   "/policy/policies": {
        "post": {
            "tags": ["Policy"],
            "security": [{ "ApiKeyAuth": [] }],
            "summary": "Create a new policy",
            "description": "Define a policy with specific authorization and delegation rules for the Sales Department.",
            "operationId": "createPolicy",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "example": "Sales Department Action Policy"
                                },
                                "priority": {
                                    "type": "integer",
                                    "example": 100
                                },
                                "authorizationRules": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "action": {
                                                "type": "string",
                                                "example": "set_sale_target"
                                            },
                                            "entityConditions": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "key": { "type": "string", "example": "pos" },
                                                        "value": { "type": "string", "example": "Sales Manager" },
                                                        "operation": { "type": "string", "example": "=" }
                                                    }
                                                }
                                            },
                                            "objectConditions": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "key": { "type": "string", "example": "department" },
                                                        "value": { "type": "string", "example": "Sales" },
                                                        "operation": { "type": "string", "example": "=" }
                                                    }
                                                }
                                            },
                                            "environmentConditions": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "key": { "type": "string", "example": "day" },
                                                        "value": { "type": "string", "example": "7" },
                                                        "operation": { "type": "string", "example": "<>" }
                                                    }
                                                }
                                            },
                                            "conditionType": { "type": "string", "example": "allow" },
                                            "delegation": { "type": "boolean", "example": false }
                                        }
                                    }
                                },
                                "delegationRules": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "action": {
                                                "type": "string",
                                                "example": "set_sale_target"
                                            },
                                            "entityConditions": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "key": { "type": "string", "example": "pos" },
                                                        "value": { "type": "string", "example": "Sales Manager" },
                                                        "operation": { "type": "string", "example": "=" }
                                                    }
                                                }
                                            },
                                            "conditionType": { "type": "string", "example": "allow" },
                                            "duration": { "type": "integer", "example": 14 },
                                            "delegation": { "type": "boolean", "example": true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Policy successfully created.",
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
                                        "example": ["add_success"]
                                    },
                                    "content": {
                                        "type": "object",
                                        "properties": {
                                            "authorizationRules": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["6734c882b8400856b81eb1cd", "6734c882b8400856b81eb1d4"]
                                            },
                                            "delegationRules": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["6734c882b8400856b81eb1e1"]
                                            },
                                            "_id": {
                                                "type": "string",
                                                "example": "6734c882b8400856b81eb1e4"
                                            },
                                            "name": {
                                                "type": "string",
                                                "example": "Sales Department Action Policy"
                                            },
                                            "priority": {
                                                "type": "integer",
                                                "example": 100
                                            },
                                            "createdAt": {
                                                "type": "string",
                                                "format": "date-time",
                                                "example": "2024-11-13T15:40:50.354Z"
                                            },
                                            "updatedAt": {
                                                "type": "string",
                                                "format": "date-time",
                                                "example": "2024-11-13T15:40:50.354Z"
                                            },
                                            "__v": { "type": "integer", "example": 0 },
                                            "id": { "type": "string", "example": "6734c882b8400856b81eb1e4" }
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
    },
    "/policy/policies/{id}": {
        "delete": {
            "tags": ["Policy"],
            "summary": "Delete a policy",
            "description": "Delete a specific policy by its ID and return the details of the deleted policy.",
            "operationId": "deletePolicy",
            "parameters": [
                {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string"
                },
                "description": "The unique identifier of the policy to delete"
                }
            ],
            "responses": {
                "200": {
                "description": "Policy successfully deleted",
                "content": {
                    "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                        "success": {
                            "type": "boolean",
                            "description": "Indicates if the deletion was successful"
                        },
                        "messages": {
                            "type": "array",
                            "items": {
                            "type": "string"
                            },
                            "description": "Contains a list of messages regarding the deletion status"
                        },
                        "content": {
                            "type": "object",
                            "description": "The details of the deleted policy",
                            "properties": {
                            "authorizationRules": {
                                "type": "array",
                                "items": {
                                "type": "string"
                                },
                                "description": "List of Rule ObjectIds associated with the deleted policy"
                            },
                            "delegationRules": {
                                "type": "array",
                                "items": {
                                "type": "string"
                                },
                                "description": "List of delegation Rule ObjectIds associated with the deleted policy"
                            },
                            "_id": {
                                "type": "string",
                                "description": "The unique identifier of the deleted policy"
                            },
                            "name": {
                                "type": "string",
                                "description": "Name of the deleted policy"
                            },
                            "priority": {
                                "type": "integer",
                                "description": "Priority level of the deleted policy"
                            },
                            "createdAt": {
                                "type": "string",
                                "format": "date-time",
                                "description": "Timestamp of when the policy was created"
                            },
                            "updatedAt": {
                                "type": "string",
                                "format": "date-time",
                                "description": "Timestamp of the last update to the policy"
                            },
                            "__v": {
                                "type": "integer",
                                "description": "Internal version key"
                            },
                            "id": {
                                "type": "string",
                                "description": "The unique identifier of the deleted policy (redundant field with _id)"
                            }
                            }
                        }
                        }
                    }
                    }
                }
                },
                "404": {
                "description": "Policy not found",
                "content": {
                    "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                        "success": {
                            "type": "boolean"
                        },
                        "messages": {
                            "type": "array",
                            "items": {
                            "type": "string"
                            },
                            "description": "Describes the error message if policy is not found"
                        }
                        }
                    }
                    }
                }
                },
                "500": {
                "description": "Server error",
                "content": {
                    "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                        "success": {
                            "type": "boolean"
                        },
                        "messages": {
                            "type": "array",
                            "items": {
                            "type": "string"
                            },
                            "description": "Describes the error message if a server error occurs"
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
module.exports = openapi_policyRoute;
