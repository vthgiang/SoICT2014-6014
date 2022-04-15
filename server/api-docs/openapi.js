const apiTagNames = require('./apiTagName');

const openApi_documentScheme = require('../models/document/_openapi');
const openApi_taskScheme = require('../models/task/_openapi');
const openApi_orderSchema= require('../models/production/order/_openapi');

const openApi_systemAdminManagementRoute = require('../modules/system-admin/system-api/system-api-management/_openapi');
const openapi_documentRoute = require("../modules/document/_openapi");
const openapi_taskManagementRoute = require('../modules/task/task-management/_openapi');
const openapi_taskPerformRoute = require('../modules/task/task-perform/_openapi');
const openapi_organizationalUnit = require('../modules/super-admin/organizational-unit/_openapi');
const openapi_user = require('../modules/super-admin/user/_openapi');
const openapi_assetManagementRoute = require('../modules/asset/asset-management/_openapi');
const openapi_systemApiPrivilege = require('../modules/system-admin/system-api/system-api-privilege/_openapi');
const openapi_orderBankAccountRoute = require('../modules/production/order/bank-account/_openapi');
const openapi_orderBusinessDepartmentRoute = require("../modules/production/order/business-department/_openapi");
const openapi_orderCoinRuleRoute = require("../modules/production/order/coin-rule/_openapi");
const openapi_orderDiscountRoute = require("../modules/production/order/discount/_openapi");
const openapi_orderPaymentRoute = require("../modules/production/order/payment/_openapi");
const openapi_orderPurchaseOrderRoute = require("../modules/production/order/purchase-order/_openapi");
const openapi_orderQuoteRoute = require("../modules/production/order/quote/_openapi");
const openapi_orderSaleOrderRoute = require("../modules/production/order/sales-order/_openapi");

const allAppRouteSpec = {
    ...openApi_systemAdminManagementRoute,
    ...openapi_documentRoute,
    ...openapi_taskManagementRoute,
    ...openapi_taskPerformRoute,
    ...openapi_organizationalUnit,
    ...openapi_user,
    ...openapi_assetManagementRoute,
    ...openapi_systemApiPrivilege,
    ...openapi_orderBankAccountRoute,
    ...openapi_orderBusinessDepartmentRoute,
    ...openapi_orderCoinRuleRoute,
    ...openapi_orderDiscountRoute,
    ...openapi_orderPaymentRoute,
    ...openapi_orderPurchaseOrderRoute,
    ...openapi_orderQuoteRoute,
    ...openapi_orderSaleOrderRoute
}

const openApiData = {
    openapi: "3.0.3",
    info: {
        title: "Dxclan api documentation",
        version: "1.0.0",
        description: 'RESTful System API for Dxclan server',
        contact: { email: "apiteam@swagger.io" }
    },
    servers: [
        {
            url: `http://localhost:8000`,
            description: 'Localhost server'
        },
        {
            url: `https://dxclan.com:5000`,
            description: 'Production server'
        }
    ],
    tags: [
        { name: apiTagNames.CRM, description: "Api module Crm" },
        { name: apiTagNames.DOCUMENT, description: "Api module Document" },
        { name: apiTagNames.TASK_TEMPLATE, description: "Api module TaskTemplate" },
        { name: apiTagNames.TASK_MANAGEMENT, description: "Api module Task-management" },
        { name: apiTagNames.TASK_PERFORM, description: "Api module TaskPerform" },
        { name: apiTagNames.ASSET, description: "Api module Asset" },
        { name: apiTagNames.KPI, description: "Api module KPI" },
        { name: apiTagNames.USER, description: "Api module User" },
        { name: apiTagNames.ORGANIZATIONAL, description: "Api module organizational" },
        { name: apiTagNames.SYSTEM_API, description: "Manage system api" },
        { name: apiTagNames.SYSTEM_PRIVILEGE_API, description: "Manage system privilege api" },
        { name: apiTagNames.ORDER, description: "Manage order api" },
    ],
    components: {
        schemas: {
            ...openApi_documentScheme,
            ...openApi_taskScheme,
            ...openApi_orderSchema
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            },
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "utk"
            }
        },
    },
    paths: allAppRouteSpec
}

module.exports = { openApiData, allAppRouteSpec };