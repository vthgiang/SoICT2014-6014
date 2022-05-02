const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderCoinRuleRoute = {
  "/coin-rule": {
    "post": {
      "tags": [apiTagNames.ORDER],
      "description": "create new coin rule",
      "operationId": "createCoinRule",
      "parameters": [],
      "security": [{ ApiKeyAuth: [] }],
      "requestBody": {
        "description": "Nhập thông tin coin rule",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/CoinRule" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/CoinRule" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "create_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CoinRule" }
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
  }
}

module.exports = openapi_orderCoinRuleRoute;
