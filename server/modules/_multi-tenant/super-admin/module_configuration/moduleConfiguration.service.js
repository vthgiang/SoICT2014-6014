const {
    ModuleConfiguration
} = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Thêm quyền truy cập tới Link cho một Role truyền vào
 */
exports.getHumanResourceConfiguration = async (portal) => {
    console.log()
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).find();
    return config[0].humanResource;
}