const apiTagNames = require("../../../../../api-docs/apiTagName");

const openapi_systemApiPrivilege = {
    "/system-admin/system-api/privilege-apis": {
        get: {
            description: "Get all privilege apis",
            tags: [apiTagNames.SYSTEM_PRIVILEGE_API],
            security: [{ ApiKeyAuth: [] }]
        },
        post: {
            description: "Create all privilege apis",
            tags: [apiTagNames.SYSTEM_PRIVILEGE_API],
            security: [{ ApiKeyAuth: [] }]
        },
        patch: {
            description: "Update all privilege apis",
            tags: [apiTagNames.SYSTEM_PRIVILEGE_API],
            security: [{ ApiKeyAuth: [] }]
        },
        delete: {
            description: "Delete privilege apis",
            tags: [apiTagNames.SYSTEM_PRIVILEGE_API],
            security: [{ ApiKeyAuth: [] }]
        },
    }
}

module.exports = openapi_systemApiPrivilege;