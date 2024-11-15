const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderPaymentRoute = {
  "/payment": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "Get all payment",
      "operationId": "getPayments",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
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
          "name": "code",
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
          "required": "true"
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
      "description": "create new payment",
      "operationId": "createNewPayment",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [],
      "requestBody": {
        "description": "Nhập thông tin payment",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/Payment" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/Payment" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "create_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Payment" }
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
  "/payment/{paymentId}": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "Get payment detail",
      "operationId": "getPaymentDetail",
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
          "description": "get_payment_detail_successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "400": {
          "description": "get_payment_detail_failed",
          "content": {}
        }
      }
    },

  },
  "/payment/get-for-order": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "Get payment for order",
      "operationId": "getPaymentForOrder",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "orderId",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
        {
          "in": "query",
          "name": "orderType",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
      ],
      "responses": {
        "200": {
          "description": "get_payment_for_order_successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "400": {
          "description": "get_payment_for_order_failed",
          "content": {}
        }
      }
    },

  },
}

module.exports = openapi_orderPaymentRoute;
