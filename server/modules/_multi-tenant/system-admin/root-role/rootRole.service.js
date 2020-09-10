const { RootRole } = require('../../../models').schema;

exports.getAllRootRoles = async () => {
    
    return await RootRole.find();
}
