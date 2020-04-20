const { RoleDefault } = require('../../../models').schema;

exports.get = async () => {
    
    return await RoleDefault.find();
}
