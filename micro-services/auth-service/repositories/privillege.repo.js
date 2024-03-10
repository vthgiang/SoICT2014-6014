const Privilege = require('@/models/privilege.model');

const getPrivilegesByRoleAndResourceType = async (roles) => {
    return await Privilege
        .find({
            roleId: { $in: roles },
            resourceType: 'Link',
        })
        .populate({ path: 'resourceId' });
}

module.exports = {
    getPrivilegesByRoleAndResourceType,
}
