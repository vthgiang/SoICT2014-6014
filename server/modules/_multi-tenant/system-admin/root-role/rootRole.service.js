const { RootRole } = require(`${SERVER_MODELS_DIR}/_multi-tenant`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllRootRoles = async (portal) => {
    
    return await RootRole(connect(DB_CONNECTION, portal)).find();
}
