const apiTagNames = require("../../../../../api-docs/apiTagName");
const openapi_billRoute = {
    "/bills": {
        "get": { //Lấy tất cả các phiếu theo kiểu
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả các phiếu theo kiểu",
            "operationId": "getBillsByType",
            "parameters": [
                {
                    "in": "query",
                    "name": "group",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "stock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "toStock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "supplier",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "creator",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "type",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "endDate",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "customer",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },

            ],
            "responses": {
                "200": {
                    "description": "get_all_bills_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_all_bills_fail",
                    "content": {}
                }
            }
        }
    },

    "/bills/get-all-bills-by-group": {
        "get": { //Lấy tất cả các phiếu theo nhóm
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả các phiếu theo nhóm",
            "operationId": "getAllBillsByGroup",
            "parameters": [
                {
                    "in": "query",
                    "name": "group",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "requestBody": {
                "description": "Nhập thông tin nhóm phiếu",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "get_all_bills_by_group_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_all_bills_by_group_fail",
                    "content": {}
                }
            }
        }
    },

    "/bills/get-bill-by-good": {
        "get": { //Lấy tất cả các phiếu theo hàng hóa
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả các phiếu theo từng hàng hóa",
            "operationId": "getBillByGood",
            "parameters": [],
            "requestBody": {
                "description": "Nhập thông tin hàng hóa",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "get_bill_by_good_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_bill_by_good_fail",
                    "content": {}
                }
            }
        }
    },

    "/bills/get-detail-bill/{billId}": {
        "get": { //Lấy chi tiết phiếu theo id
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy chi tiết phiếu theo id",
            "operationId": "getBillByGood",
            "parameters": [
                {
                    "name": "billId",
                    "in": "path",
                    "description": "Nhập id phiếu",
                    "required": true,
                    "schema": { "type": "string" }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_detail_bill_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_detail_bill_fail",
                    "content": {}
                }
            }
        }
    },

    "/bills": {
        "post": {
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Tạo phiếu",
            "operationId": "createBill",
            "parameters": [
                {
                    "in": "query",
                    "name": "fromStock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "group",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "toStock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "type",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "users",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "approvers",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "accountables",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "responsibles",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "qualityControlStaffs",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "customer",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "supplier",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "description",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "sourceType",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "manufacturingMill",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "manufacturingCommand",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin phiếu",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_bill_success",
                },
                "400": {
                    "description": "create_bill_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },

    "/bills/{billId}": {
        "patch": { // Cập nhật phiếu
            "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Cập nhật phiếu",
            "operationId": "updateBill",
            "parameters": [
                {
                    "name": "billId",
                    "in": "path",
                    "description": "Nhập id phiếu",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "in": "query",
                    "name": "fromStock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "group",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "toStock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "code",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "type",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "users",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "approvers",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "accountables",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "responsibles",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "qualityControlStaffs",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "customer",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "supplier",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "description",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "sourceType",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "good",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "manufacturingMill",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "manufacturingCommand",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin phiếu",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "dateCreatedAt": { "type": "string" },
                                "type": { "type": "string" },
                                "description": { "type": "string" },
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "update_bill_success",
                },
                "400": {
                    "description": "update_bill_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },

    "/bills/get-bill-by-status": {
        "get": { //Lấy tất cả các phiếu theo trạng thái
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả các phiếu theo trạng thái",
            "operationId": "getBillByStatus",
            "parameters": [
                {
                    "in": "query",
                    "name": "status",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_bill_by_status_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_bill_by_status_fail",
                    "content": {}
                }
            }
        }
    },

    "/bills/bill-by-command": {
        "get": { //Lấy tất cả các phiếu  theo lệnh sản xuất
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả các phiếu theo lệnh sản xuất",
            "operationId": "getBillsByCommand",
            "parameters": [
                {
                    "in": "query",
                    "name": "manufacturingCommandId",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_bills_by_command_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_bills_by_command_fail",
                    "content": {}
                }
            }
        }
    },

    
    "/bills/get-number-bill": {
        "get": { //Lấy số lượng phiếu theo nhóm
            "tags": [apiTagNames.BILL],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy số lượng phiếu theo nhóm",
            "operationId": "getNumberBills",
            "parameters": [
                {
                    "in": "query",
                    "name": "Stock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "createdAt",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
            ],
            "responses": {
                "200": {
                    "description": "get_number_bills_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_number_bills_fail",
                    "content": {}
                }
            }
        }
    },

}

module.exports = openapi_billRoute;
