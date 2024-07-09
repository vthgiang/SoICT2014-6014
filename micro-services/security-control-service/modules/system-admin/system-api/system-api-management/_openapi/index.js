const apiTagNames = require("../../../../../api-docs/apiTagName");

const openApi_systemAdminManagementRoute = {
    "/system-admin/system-api/system-apis": {
        get: {
            description: "Get system apis",
            tags: [apiTagNames.SYSTEM_API],
            security: [{ ApiKeyAuth: [] }]
        },
        post: {
            description: "Create system apis",
            tags: [apiTagNames.SYSTEM_API],
            security: [{ ApiKeyAuth: [] }]
        },
        patch: {
            description: "Edit system apis",
            tags: [apiTagNames.SYSTEM_API],
            security: [{ ApiKeyAuth: [] }]
        },
        delete: {
            description: "Delete system apis",
            tags: [apiTagNames.SYSTEM_API],
            security: [{ ApiKeyAuth: [] }]
        }
    },
    "/system-admin/system-api/system-apis/update-auto": {
        post: {
            description: "Cập nhật các api mới nhất",
            tags: [apiTagNames.SYSTEM_API],
            operationId: "updateSystemApi",
            security: [{ ApiKeyAuth: [] }],
            responses: {
                200: {
                    description: "update_system_api_success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    add: {
                                        type: "array",
                                        example: []
                                    },
                                    removed: {
                                        type: "array",
                                        example: []
                                    },
                                    modified: {
                                        type: "array",
                                        example: []
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "update_system_api_failed",
                    content: {}
                }
            },
        }
    }
}

module.exports = openApi_systemAdminManagementRoute;