const apiTagNames = require("../../../../../api-docs/apiTagName");
const openapi_binLocationRoute = {
    "/bin-locations": {
        "get": { //Lấy tất cả khu vực lưu trữ
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả khu vực lưu trữ",
            "operationId": "getBinLocations",
            "parameters": [
                {
                    "in": "query",
                    "name": "stock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_bin_locations_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_bin_locations_fail",
                    "content": {}
                }
            }
        }
    },

    "/bin-locations/get-child": {
        "get": { //Lấy tất cả khu vực lưu trữ con
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả khu vực lưu trữ con",
            "operationId": "getChildBinLocations",
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
                    "name": "stock",
                    "schema": {
                        "type": "string"
                    },
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "get_child_bin_locations_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_child_bin_locations_fail",
                    "content": {}
                }
            }
        }
    },

    "/bin-locations/get-detail/{binLocationId}": {
        "get": { //Lấy chi tiết khu vực lưu trữ
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy chi tiết khu vực lưu trữ",
            "operationId": "getBinLocationDetail",
            "parameters": [
                {
                    "name": "binLocationId",
                    "in": "path",
                    "description": "Nhập id khu vực lưu trữ",
                    "required": true,
                    "schema": { "type": "string" }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_bin_location_detail_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_bin_location_detail_fail",
                    "content": {}
                }
            }
        }
    },

    "/bin-locations": {
        "post": { //Thêm khu vực lưu trữ
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Thêm khu vực lưu trữ",
            "operationId": "createBinLocation",
            "parameters": [
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
                    "name": "name",
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
                    "name": "description",
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
                    "name": "child",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "enableGoods",
                    "schema": {
                        "type": "array",
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "capacity",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "contained",
                    "schema": {
                        "type": "array",
                    },
                    "required": "true"
                },
                {
                    "in": "query",
                    "name": "unit",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "department",
                    "schema": {
                        "type": "array",
                    },
                    "required": "true"
                },

            ],
            "responses": {
                "200": {
                    "description": "create_bin_location_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "create_bin_location_fail",
                    "content": {}
                }
            }
        }
    },
    "/bin-locations/{binLocationId}": {
        "patch": { //Chỉnh sửa khu vực lưu trữ
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Chỉnh sửa khu vực lưu trữ",
            "operationId": "updateBinLocation",
            "parameters": [
                {
                    "name": "binLocationId",
                    "in": "path",
                    "description": "Nhập id khu vực lưu trữ",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
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
                    "name": "name",
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
                    "name": "description",
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
                    "name": "users",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "child",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "enableGoods",
                    "schema": {
                        "type": "array",
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "capacity",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "contained",
                    "schema": {
                        "type": "array",
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "unit",
                    "schema": {
                        "type": "string"
                    },
                    "required": "false"
                },
                {
                    "in": "query",
                    "name": "department",
                    "schema": {
                        "type": "array",
                    },
                    "required": "false"
                },

            ],
            "responses": {
                "200": {
                    "description": "update_bin_location_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "update_bin_location_fail",
                    "content": {}
                }
            }
        }
    },

    "/bin-locations/{binLocationId}": {
        "delete": {
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Delete bin location",
            "operationId": "deleteBinLocation",
            "parameters": [
                {
                    "name": "binLocationId",
                    "in": "path",
                    "description": "Nhập id khu vực lưu trữ",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                ],
            "responses": {
                "200": {
                    "description": "delete_bin_location_success",
                },
                "400": {
                    "description": "delete_bin_location_fail",
                    "content": {}
                }
            }
        }
    },
    "/bin-locations/delete-many" : {
        "post": {
            "tags": [apiTagNames.BIN_LOCATION],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Delete many bin location",
            "operationId": "deleteManyBinLocation",
            "parameters": [
                {
                    "name": "ids",
                    "in": "body",
                    "description": "Nhập id khu vực lưu trữ",
                    "required": true,
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "delete_many_bin_location_success",
                },
                "400": {
                    "description": "delete_many_bin_location_fail",
                    "content": {}
                }
            }
        }
    },
}
module.exports = openapi_binLocationRoute;
