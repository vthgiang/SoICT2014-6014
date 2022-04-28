const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderQuoteRoute = {
  "/quote": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "Get all quotes",
      "operationId": "getQuotes",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "code",
          "schema": {
            "type": "number"
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
          "name": "customer",
          "schema": {
            "type": "string"
          },
        },
        {
          "in": "query",
          "name": "queryDate",
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
          "description": "get_successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "400": {
          "description": "get_failed",
          "content": {}
        }
      }
    },
    "post": {
      "tags": [apiTagNames.ORDER],
      "description": "create new quote",
      "operationId": "createNewQuote",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [],
      "requestBody": {
        "description": "Nhập thông tin quote",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/Quote" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/Quote" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "create_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Quote" }
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
  "/quote/get-to-make-order": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get quotes to make order",
      "operationId": "getQuotesToMakeOrder",
      "security": [{ ApiKeyAuth: [] }],
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
          "description": "get_quotes_to_make_order_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "get_quotes_to_make_order_failed",
          "content": {}
        }
      },
    },
  },
  "/quote/count": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "count quote",
      "operationId": "countQuote",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "currentRole",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "startDate",
          "schema": {
            "type": "string",
            "format": "date"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "endDate",
          "schema": {
            "type": "string",
            "format": "date"
          },
          "required": "true"
        },
      ],
      "responses": {
        "200": {
          "description": "count_quote_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "count_quote_failed",
          "content": {}
        }
      },
    },
  },
  "/quote/get-top-good-care": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get top goods care",
      "operationId": "getTopGoodCare",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "currentRole",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "startDate",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "endDate",
          "schema": {
            "type": "string",
            "format": "date"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "status",
          "schema": {
            "type": "string",
            "format": "date"
          },
          "required": "true"
        },
      ],
      "responses": {
        "200": {
          "description": "get_top_goods_care_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "get_top_goods_care_failed",
          "content": {}
        }
      },
    },
  },
  "/quote/{quoteId}": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get quote detail",
      "operationId": "getQuoteDetail",
      "security": [{ ApiKeyAuth: [] }],
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
      "description": "edit quote",
      "operationId": "editQuote",
      "security": [{ ApiKeyAuth: [] }],
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
        "description": "Nhập thông tin quote",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/Quote" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/Quote" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "edit_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Quote" }
            }
          }
        },
        "400": {
          "description": "edit_failed",
          "content": {}
        }
      },
    },
    "delete": {
      "tags": [apiTagNames.ORDER],
      "description": "delete quote",
      "operationId": "deleteQuote",
      "security": [{ ApiKeyAuth: [] }],
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
          "description": "delete_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "delete_failed",
          "content": {}
        }
      },
    },
  },
  "/quote/approve/{approveId}": {
    "patch": {
      "tags": [apiTagNames.ORDER],
      "description": "approve quote",
      "operationId": "approveQuote",
      "security": [{ ApiKeyAuth: [] }],
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
            "schema": { "$ref": "#components/schemas/Approvers" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/Approvers" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "approve_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Approvers" }
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
}

module.exports = openapi_orderQuoteRoute;
