const { RoleDefault } = require('../../../models/_export').data;

exports.get = async () => {
    
    return await RoleDefault.find();
}
