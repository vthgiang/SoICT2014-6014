const RoleDefaultServices = require('./rootRole.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllRootRoles = async (req, res) => {
    try {
        var roleDefaults = await RoleDefaultServices.getAllRootRoles();
        LogInfo(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_roles_default_success'],
            content: roleDefaults
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: error
        });
    }
};
