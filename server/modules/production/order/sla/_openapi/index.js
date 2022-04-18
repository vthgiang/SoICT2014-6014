const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_orderSlaRoute = {
  "/sla": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "Get all sla",
      "operationId": "getSla",
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
          "name": "title",
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
      "description": "create new sla",
      "operationId": "createNewSla",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [],
      "requestBody": {
        "description": "Nhập thông tin sla",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/ServiceLevelAgreement" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/ServiceLevelAgreement" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "create_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ServiceLevelAgreement" }
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
    "delete": {
      "tags": [apiTagNames.ORDER],
      "description": "delete sle",
      "operationId": "deleteSla",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "code",
          "schema": {
            "type": "string"
          },
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
  "/sla/check-code": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "check available code",
      "operationId": "checkAvailableCode",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "code",
          "schema": {
            "type": "string"
          },
          "required": "true"
        },
      ],
      "responses": {
        "200": {
          "description": "check_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "check_failed",
          "content": {}
        }
      },
    },
  },
  "/sla/get-by-code": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get sla by code",
      "operationId": "getSlaByCode",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "code",
          "schema": {
            "type": "string"
          },
          "required": "false"
        },
      ],
      "responses": {
        "200": {
          "description": "get_by_code_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "get_by_code_get_failed",
          "content": {}
        }
      },
    },
  },
  "/sla/get-by-good-id": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get sla by good id",
      "operationId": "getSlaByGoodId",
      "security": [{ ApiKeyAuth: [] }],
      "parameters": [
        {
          "in": "query",
          "name": "goodId",
          "schema": {
            "type": "string"
          },
        },
      ],
      "responses": {
        "200": {
          "description": "get_by_good_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "get_by_good_failed",
          "content": {}
        }
      },
    },
  },
  "/sla/{slaId}": {
    "get": {
      "tags": [apiTagNames.ORDER],
      "description": "get sla detail by id",
      "operationId": "getSlaDetail",
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
          "description": "get_by_id_successfully",
          "content": {
            "type": "object"
          }
        },
        "400": {
          "description": "get_by_id_failed",
          "content": {}
        }
      },
    },
    "patch": {
      "tags": [apiTagNames.ORDER],
      "description": "edit sla by code",
      "operationId": "editSla",
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
        "description": "Nhập thông tin sla",
        "content": {
          "application/json": {
            "schema": { "$ref": "#components/schemas/ServiceLevelAgreement" }
          },
          "application/xml": {
            "schema": { "$ref": "#components/schemas/ServiceLevelAgreement" }
          },
          "required": true
        }
      },
      "responses": {
        "200": {
          "description": "edit_successfully",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ServiceLevelAgreement" }
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
  "/sla/disable/{id}": {
    "patch": {
      "tags": [apiTagNames.ORDER],
      "description": "disable sla by id",
      "operationId": "disableSlaById",
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
          "description": "disable_successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "400": {
          "description": "disable_failed",
          "content": {}
        }
      },
    },
  },
}

module.exports = openapi_orderSlaRoute;
