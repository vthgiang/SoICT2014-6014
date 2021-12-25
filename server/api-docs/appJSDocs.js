const swaggerJSDoc = require("swagger-jsdoc");

module.exports = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "QLCV Library API",
            version: "1.0.0",
            description: "QLCV Library API",
        },
        servers: [
            {
                url: `http://localhost:3000`,
                description: 'Localhost server'
            },
        ],
    },
    apis: ["./{modules, models}/**/*.js"],
});