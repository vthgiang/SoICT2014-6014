// const apiTagNames = require("../../../../../api-docs/apiTagName");

// const openapi_orderDiscountRoute = {
//   "/discount": {
//     "get": {
//       "tags": [apiTagNames.ORDER],
//       "description": "Get all discounts",
//       "operationId": "getDiscounts",
//       "security": [{ ApiKeyAuth: [] }],
//       "parameters": [
//         {
//           "in": "query",
//           "name": "queryDate",
//           "schema": {
//             "type": "string"
//           },
//           "required": "true"
//         },
//         {
//           "in": "query",
//           "name": "code",
//           "schema": {
//             "type": "string"
//           },
//           "required": "true"
//         },
//         {
//           "in": "query",
//           "name": "name",
//           "schema": {
//             "type": "string"
//           },
//           "required": "true"
//         },
//         {
//           "in": "query",
//           "name": "page",
//           "schema": {
//             "type": "integer"
//           },
//         },
//         {
//           "in": "query",
//           "name": "limit",
//           "schema": {
//             "type": "integer"
//           }
//         }
//       ],
//       "responses": {
//         "200": {
//           "description": "get_all_successfully",
//           "content": {
//             "application/json": {
//               "schema": {
//                 "type": "object"
//               }
//             }
//           }
//         },
//         "400": {
//           "description": "get_all_failed",
//           "content": {}
//         }
//       }
//     },
//     "post": {
//       "tags": [apiTagNames.ORDER],
//       "description": "create new discount",
//       "operationId": "createNewDiscount",
//       "parameters": [],
//       "security": [{ ApiKeyAuth: [] }],
//       "requestBody": {
//         "description": "Nhập thông tin discount",
//         "content": {
//           "application/json": {
//             "schema": { "$ref": "#components/schemas/Discount" }
//           },
//           "application/xml": {
//             "schema": { "$ref": "#components/schemas/Discount" }
//           },
//           "required": true
//         }
//       },
//       "responses": {
//         "200": {
//           "description": "create_successfully",
//           "content": {
//             "application/json": {
//               "schema": { "$ref": "#/components/schemas/Discount" }
//             }
//           }
//         },
//         "400": {
//           "description": "create_failed",
//           "content": {}
//         }
//       },
//       "x-codegen-request-body-name": "body"
//     },
//     "delete": {
//       "tags": [apiTagNames.ORDER],
//       "description": "delete a discount",
//       "operationId": "deleteNewDiscount",
//       "security": [{ ApiKeyAuth: [] }],
//       "parameters": [
//         {
//           "in": "query",
//           "name": "code",
//           "schema": {
//             "type": "string"
//           },
//           "required": "true"
//         }
//       ],
//       "responses": {
//         "200": {
//           "description": "delete_successfully",
//           "content": {
//             "application/json": {
//               "schema": { "$ref": "#/components/schemas/Discount" }
//             }
//           }
//         },
//         "400": {
//           "description": "delete_successfully",
//           "content": {}
//         }
//       },
//       "x-codegen-request-body-name": "body"
//     },
//   },
//   "/discount/{discountId}": {
//     "patch": {
//       "tags": [apiTagNames.ORDER],
//       "description": "Update a discount",
//       "operationId": "UpdateDiscount",
//       "security": [{ ApiKeyAuth: [] }],
//       "parameters": [
//         {
//           "in": "path",
//           "name": "id",
//           "schema": {
//             "type": "string"
//           },
//           "require": true
//         },
//       ],
//       "requestBody": {
//         "description": "Nhập thông tin discount",
//         "content": {
//           "application/json": {
//             "schema": { "$ref": "#components/schemas/Discount" }
//           },
//           "application/xml": {
//             "schema": { "$ref": "#components/schemas/Discount" }
//           },
//           "required": true
//         }
//       },
//       "responses": {
//         "200": {
//           "description": "edit_successfully",
//           "content": {
//             "application/json": {
//               "schema": { "$ref": "#/components/schemas/Discount" }
//             }
//           }
//         },
//         "400": {
//           "description": "edit_failed",
//           "content": {}
//         }
//       },
//       "x-codegen-request-body-name": "body"
//     }
//   },
//   "/discount/get-by-good-id": {
//     "get": {
//       "tags": [apiTagNames.ORDER],
//       "description": "get discount by goods id",
//       "operationId": "getDiscountByGoodId",
//       "security": [{ ApiKeyAuth: [] }],
//       "parameters": [
//         {
//           "in": "query",
//           "name": "goodId",
//           "schema": {
//             "type": "string"
//           },
//           "require": true
//         },
//         {
//           "in": "query",
//           "name": "quanity",
//           "schema": {
//             "type": "number"
//           },
//           "require": true
//         },
//       ],
//       "responses": {
//         "200": {
//           "description": "get_by_good_successfully",
//           "content": {
//             "application/json": {
//               "schema": {
//                 "type": "object"
//               }
//             }
//           }
//         },
//         "400": {
//           "description": "get_by_good_failed",
//           "content": {}
//         }
//       }
//     }
//   },
//   "/discount/get-by-order-value": {
//     "get": {
//       "tags": [apiTagNames.ORDER],
//       "description": "get discount by goods id",
//       "operationId": "getDiscountByGoodId",
//       "parameters": [],
//       "security": [{ ApiKeyAuth: [] }],
//       "responses": {
//         "200": {
//           "description": "get_for_order_successfully",
//           "content": {
//             "application/json": {
//               "schema": {
//                 "type": "object"
//               }
//             }
//           }
//         },
//         "400": {
//           "description": "get_for_order_failed",
//           "content": {}
//         }
//       }
//     }
//   },
//   "/discount/change-status/{id}": {
//     "get": {
//       "tags": [apiTagNames.ORDER],
//       "description": "get discount status",
//       "operationId": "getDiscountStatus",
//       "security": [{ ApiKeyAuth: [] }],
//       "parameters": [{
//         "in": "path",
//         "name": "id",
//         "schema": {
//           "type": "string"
//         },
//         "required": "true"
//       },],
//       "responses": {
//         "200": {
//           "description": "change_status_successfully",
//           "content": {
//             "application/json": {
//               "schema": {
//                 "type": "object"
//               }
//             }
//           }
//         },
//         "400": {
//           "description": "change_status_failed",
//           "content": {}
//         }
//       }
//     }
//   },
// }

// module.exports = openapi_orderDiscountRoute;
