const openApi_securityScheme = require('../models/security/_openapi');

const openapi_entityRoute = require("../modules/security/entity/_openapi");
const openapi_objectRoute = require("../modules/security/object/_openapi");
const openapi_logRoute = require("../modules/security/log/_openapi");
const openapi_policyRoute = require("../modules/security/policy/_openapi");
const openapi_authorizationRoute = require("../modules/security/auth/_openapi");

const allAppRouteSpec = {
    ...openapi_entityRoute,
    ...openapi_objectRoute,
    ...openapi_logRoute,
    ...openapi_policyRoute,
    ...openapi_authorizationRoute
}

const openApiData = {
    openapi: "3.0.3",
    info: {
        title: "Api documentation",
        version: "1.0.0",
        description: 'RESTful Delegated Authorization System API',
        contact: { email: "apiteam@swagger.io" }
    },
    servers: [
        // {
        //     url: `http://localhost:8000`,
        //     description: 'Localhost server'
        // },
        {
            url: `http://103.166.185.48:8000`,
            description: 'Production server'
        }
    ],
    components: {
        schemas: {
            ...openApi_securityScheme
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
