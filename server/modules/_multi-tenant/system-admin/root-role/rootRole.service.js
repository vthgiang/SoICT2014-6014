const { RootRole } = require(`${SERVER_MODELS_DIR}/_multi-tenant`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllRootRoles = async () => {
    
    return await RootRole(connect(DB_CONNECTION, process.env.DB_NAME)).find();
}
