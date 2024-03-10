const UserRole = require('@/models/userRole.model');

const findByRoleIdAndUserId = async (userId, roleId) => {
    return await UserRole.findOne({ userId, roleId });
}

module.exports = {
    findByRoleIdAndUserId,
}
