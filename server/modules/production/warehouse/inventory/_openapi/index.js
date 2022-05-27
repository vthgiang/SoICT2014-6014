const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_inventoryRoute = {
    "/lot": {
        "get": { //Lấy tất cả lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả lô hàng",
            "operationId": "getAllLots",
            "parameters": [
                {
                    "in": "query",
                    "name": "managementLocation",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "limit",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "page",
                    "schema": {
                        "type": "String"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_all_lots_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_all_lots_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-detail/{id}": {
        "get": { //Lấy chi tiết lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy chi tiết lô hàng",
            "operationId": "getDetailLot",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_detail_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_detail_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/{id}": {
        "patch": { //Sửa lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Sửa lô hàng",
            "operationId": "editLot",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "body",
                    "name": "data",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "lotCode": {
                                "type": "string"
                            },
                            "good": {
                                "type": "string"
                            },
                            "quantity": {
                                "type": "string"
                            },
                            "unit": {
                                "type": "string"
                            },
                            "expirationDate": {
                                "type": "string"
                            },
                            "managementLocation": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string"
                            }
                        }
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "edit_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "edit_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/create": {
        "post": { //Tạo lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Tạo lô hàng",
            "operationId": "createLot",
            "parameters": [
                {
                    "in": "body",
                    "name": "data",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "lotCode": {
                                "type": "string"
                            },
                            "good": {
                                "type": "string"
                            },
                            "quantity": {
                                "type": "string"
                            },
                            "unit": {
                                "type": "string"
                            },
                            "expirationDate": {
                                "type": "string"
                            },
                            "managementLocation": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string"
                            }
                        }
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "create_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "create_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/delete/{id}": {
        "delete": { //Xóa lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Xóa lô hàng",
            "operationId": "deleteLot",
            "parameters": [
                {
                    "in": "path",
                    "name": "id",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "delete_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "delete_lot_fail",
                    "content": {}
                }
            }
        }
    },
   "/lot/create-or-edit-lot": {
        "post": { //Tạo lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Tạo lô hàng",
            "operationId": "createLot",
            "parameters": [
                
            ],
            "responses": {
                "200": {
                    "description": "create_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "create_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-lot-by-good": {
        "get": { //Lấy lô hàng theo sản phẩm
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lô hàng theo sản phẩm",
            "operationId": "getLotByGood",
            "parameters": [
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_lot_by_good_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_lot_by_good_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/delete-many": {
        "post": { //Xóa nhiều lô hàng
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Xóa nhiều lô hàng",
            "operationId": "deleteManyLot",
            "parameters": [
                {
                    "in": "body",
                    "name": "data",
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
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "delete_many_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "delete_many_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-manufacturing-lot": {
        "get": { //Lấy lô hàng sản xuất
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lô hàng sản xuất",
            "operationId": "getManufacturingLot",
            "parameters": [
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_manufacturing_lot_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_manufacturing_lot_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-inventory": {
        "get": { //Lấy lô hàng tồn kho theo danh sách id sản phẩm
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lô hàng tồn kho theo danh sách ids sản phẩm",
            "operationId": "getInventoryByGoodIds",
            "parameters": [
                {
                    "in": "query",
                    "name": "goodIds",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_inventory_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_inventory_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-inventory-in-stock": {
        "get": { //Lấy lô hàng tồn kho trong kho
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lô hàng tồn kho trong kho",
            "operationId": "getInventoryInStock",
            "parameters": [
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ], 
            "responses": {
                "200": { 
                    "description": "get_inventory_in_stock_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_inventory_in_stock_fail",
                    "content": {}
                }
            }
        }
    },
    "/lot/get-manufacturing-lot-number-status": {
        "get": { //Lấy số lô hàng sản xuất theo trạng thái
            "tags": [apiTagNames.LOT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy số lô hàng sản xuất theo trạng thái",
            "operationId": "getManufacturingLotNumberStatus",
            "parameters": [
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_manufacturing_lot_number_status_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_manufacturing_lot_number_status_fail",
                    "content": {}
                }
            }
        }
    },
}
module.exports = openapi_inventoryRoute;
