const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderPurchaseOrderRoute = {
    "/purchase-order": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get all purchase",
            "operationId": "getPurchases",
            "parameters": [
                {
                    "in": "query",
                    "name": "length",
                    "schema": {
                        "type": "number"
                    },
                },
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "supplier",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "page",
                    "schema": {
                        "type": "integer"
                    },
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
                    "description": "get_all_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_all_failed",
                    "content": {}
                }
            }
        },
        "post": {
            "tags": [apiTagNames.ORDER],
            "description": "create new purchase order",
            "operationId": "createNewPurchaseOrder",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin purchase order",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/PurchaseOrder"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/PurchaseOrder"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "create_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/PurchaseOrder"}
                        }
                    }
                },
                "400": {
                    "description": "create_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/purchase-order/{purchaseOrderId}": {
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "Edit purchase order",
            "operationId": "editPurchaseOrder",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin purchase order",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/PurchaseOrder"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/PurchaseOrder"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "edit_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/PurchaseOrder"}
                        }
                    }
                },
                "400": {
                    "description": "edit_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },

    },
    "/purchase-order/approve/{purchaseOrderId}": {
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "approve purchase order",
            "operationId": "approvePurchaseOrder",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin approver",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/Approvers"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/Approvers"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "approve_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Approvers"}
                        }
                    }
                },
                "400": {
                    "description": "approve_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/purchase-order/get-for-payment": {
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "Get purchase for payment",
            "operationId": "getPurchaseForPayment",
            "parameters": [
                {
                    "in": "query",
                    "name": "supplierId",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_purchase_orders_for_payment_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": 'object'
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_purchase_orders_for_payment_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
}

module.exports = openapi_orderPurchaseOrderRoute;
