const Role = require('@/models/role.model');

const findRoleById = async (roleId) => {
    return await Role.findOne({ roleId }); // get role currently
}


module.exports = {
    findRoleById,
};
