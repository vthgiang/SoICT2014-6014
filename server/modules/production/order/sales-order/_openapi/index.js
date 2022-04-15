const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderSaleOrderRoute = {
    "/sale-order/get-number-works-sales-order": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get number work sale order",
            "operationId": "getNumberWorkSaleOrder",
            "parameters": [
                {
                    "in": "query",
                    "name": "currentRole",
                    "schema": {
                        "type": "number"
                    },
                },
                {
                    "in": "query",
                    "name": "manufacturingWorks",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "fromDate",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "toDate",
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "get_number_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "number"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_number_failed",
                    "content": {}
                }
            }
        }
    },
    "/sale-order": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get all sale order",
            "operationId": "getAllSaleOrder",
            "parameters": [
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
                        "type": "string",
                    },
                },
                {
                    "in": "query",
                    "name": "customer",
                    "schema": {
                        "type": "string",
                    },
                },
                {
                    "in": "query",
                    "name": "getAll",
                    "schema": {
                        "type": "string",
                    },
                },
                {
                    "in": "query",
                    "name": "month",
                    "schema": {
                        "type": "integer",
                    },
                },
                {
                    "in": "query",
                    "name": "year",
                    "schema": {
                        "type": "integer",
                    },
                },
                {
                    "in": "query",
                    "name": "page",
                    "schema": {
                        "type": "integer",
                    },
                },
                {
                    "in": "query",
                    "name": "limit",
                    "schema": {
                        "type": "integer",
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "get_sales_order_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "get_sales_orders_failed",
                    "content": {}
                }
            },
        },
        "post": {
            "tags": [apiTagNames.ORDER],
            "description": "create new sale order",
            "operationId": "createNewSaleOrder",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin sale order",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/SaleOrder"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/SaleOrder"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "create_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/SaleOrder"}
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
    "/sale-order/{saleOrderId}": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get sale order detail",
            "operationId": "getSaleOrderDetail",
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
            "responses": {
                "200": {
                    "description": "get_detail_successfully",
                    "content": {
                        "type": "object"
                    }
                },
                "400": {
                    "description": "get_detail_failed",
                    "content": {}
                }
            },
        },
        "patch": {
            "tags": [apiTagNames.ORDER],
            "description": "edit sale order",
            "operationId": "editSaleOrder",
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
                "description": "Nhập thông tin sale order",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#components/schemas/SaleOrder"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#components/schemas/SaleOrder"}
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "edit_successfully",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/SaleOrder"}
                        }
                    }
                },
                "400": {
                    "description": "edit_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/approve/{saleOrderId}": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "approve sale order",
            "operationId": "approveSaleOrder",
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
        },
    },
    "/sale-order/add-manufacturing-plan/{id}": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Add manufacturing plan for good",
            "operationId": "addManufacturingPlanForGood",
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
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "goodId": "string",
                                    "manufacturingPlanId": "string"
                                }
                            }
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "goodId": "string",
                                    "manufacturingPlanId": "string"
                                }
                            }
                        }
                    },
                    "required": true
                }
            },
            "responses": {
                "200": {
                    "description": "add_manufacturing_for_sales_order_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "goodId": "string",
                                        "manufacturingPlanId": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "add_manufacturing_for_sales_order_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/get-by-manufacturing-works/{id}": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "get sale orders by manufacturing work",
            "operationId": "getSaleOrderByManufacturingWork",
            "parameters": [
                {
                    "in": "query",
                    "name": "currentRole",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_sales_order_by_manufacturing_works_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_sales_order_by_manufacturing_works_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/get-for-payment": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get sale order for payment",
            "operationId": "getSaleOrderForPayment",
            "parameters": [
                {
                    "in": "path",
                    "name": "customerId",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_sales_orders_for_payment_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_sales_orders_for_payment_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/count": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "count sale order",
            "operationId": "countSaleOrder",
            "parameters": [
                {
                    "in": "query",
                    "name": "startDate",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "endDate",
                    "schema": {
                        "type": "string"
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "count_sales_order_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "count_sales_order_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/get-top-good-sold": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get top goods sold",
            "operationId": "getTopGoodSold",
            "parameters": [
                {
                    "in": "query",
                    "name": "startDate",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "endDate",
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
            ],
            "responses": {
                "200": {
                    "description": "get_top_goods_sold_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_top_goods_sold_failed",
                    "content": {}
                }
            },
        },
    },
    "/sale-order/get-sales-for-departments": {
        "get": {
            "tags": [apiTagNames.ORDER],
            "description": "Get sale for department",
            "operationId": "getSaleForDepartment",
            "parameters": [
                {
                    "in": "query",
                    "name": "startDate",
                    "schema": {
                        "type": "string"
                    },
                },
                {
                    "in": "query",
                    "name": "endDate",
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
            ],
            "responses": {
                "200": {
                    "description": "get_sales_for_departments_successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_sales_for_departments_failed",
                    "content": {}
                }
            },
        },
    },
}

module.exports = openapi_orderSaleOrderRoute;
