const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_stockRoute = {
    "/stocks": {
        'get': {
            'tags': [apiTagNames.STOCK],
            "security": [{ ApiKeyAuth: [] }],
            'summary': 'Get all stocks',
            'description': 'Get all stocks',
            'operationId': 'getAllStocks',
            'parameters': [
                {
                    'name': 'page',
                    'in': 'query',
                    'description': 'Page number',
                    'required': false,
                    'schema': {
                        'type': 'integer',
                        'format': 'int32'
                    }
                },
                {
                    'name': 'limit',
                    'in': 'query',
                    'description': 'Page limit',
                    'required': false,
                    'schema': {
                        'type': 'integer',
                        'format': 'int32'
                    }
                },
                {
                    'name': 'status',
                    'in': 'query',
                    'description': 'Status',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'company',
                    'in': 'query',
                    'description': 'Company',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'code',
                    'in': 'query',
                    'description': 'Code',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'name',
                    'in': 'query',
                    'description': 'Name',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'description',
                    'in': 'query',
                    'description': 'Description',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'address',
                    'in': 'query',
                    'description': 'Address',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'goods',
                    'in': 'query',
                    'description': 'Goods',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
                {
                    'name': 'managementLocation',
                    'in': 'query',
                    'description': 'Management location',
                    'required': false,
                    'schema': {
                        'type': 'string'
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_all_stocks_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_all_stocks_fail",
                    "content": {}
                }
            }
        }
    },
    "/stocks/stock-detail/{id}": {
        'get': {
            'tags': [apiTagNames.STOCK],
            "security": [{ ApiKeyAuth: [] }],
            'summary': 'Get stock detail',
            'description': 'Get stock detail',
            'operationId': 'getStockDetail',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': 'Stock id',
                    'required': true,
                    'schema': {
                        'type': 'string',
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "get_stock_detail_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_stock_detail_fail",
                    "content": {}
                }
            }
        }
    },
    "/stocks": {
        'post': {
            'tags': [apiTagNames.STOCK],
            "security": [{ ApiKeyAuth: [] }],
            'summary': 'Create stock',
            'description': 'Create stock',
            'operationId': 'createStock',
            'parameters': [
                {
                    'name': 'body',
                    'in': 'body',
                    'description': 'Stock',
                    'required': true,
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'company': {
                                'type': 'string'
                            },
                            'code': {
                                'type': 'string'
                            },
                            'name': {
                                'type': 'string'
                            },
                            'description': {
                                'type': 'string'
                            },
                            'address': {
                                'type': 'string'
                            },
                            'goods': {
                                'type': 'string'
                            },
                            'managementLocation': {
                                'type': 'string'
                            },
                            'status': {
                                'type': 'string'
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "create_stock_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "create_stock_fail",
                    "content": {}
                }
            }
        }
    },
    "/stocks/{id}": {
        'patch': {
            'tags': [apiTagNames.STOCK],
            "security": [{ ApiKeyAuth: [] }],
            'summary': 'Update stock',
            'description': 'Update stock',
            'operationId': 'updateStock',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': 'Stock id',
                    'required': true,
                    'schema': {
                        'type': 'String',
                        'format': 'int32'
                    }
                },
                {
                    'name': 'body',
                    'in': 'body',
                    'description': 'Stock',
                    'required': true,
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'company': {
                                'type': 'string'
                            },
                            'code': {
                                'type': 'string'
                            },
                            'name': {
                                'type': 'string'
                            },
                            'description': {
                                'type': 'string'
                            },
                            'address': {
                                'type': 'string'
                            },
                            'goods': {
                                'type': 'string'
                            },
                            'managementLocation': {
                                'type': 'string'
                            },
                            'status': {
                                'type': 'string'
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "update_stock_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "update_stock_fail",
                    "content": {}
                }
            }
        }
    },
    "/stocks/{id}": {
        'delete': {
            'tags': [apiTagNames.STOCK],
            "security": [{ ApiKeyAuth: [] }],
            'summary': 'Delete stock',
            'description': 'Delete stock',
            'operationId': 'deleteStock',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': 'Stock id',
                    'required': true,
                    'schema': {
                        'type': 'string',
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "delete_stock_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "delete_stock_fail",
                    "content": {}
                }
            }
        }
    }
}
module.exports = openapi_stockRoute;
