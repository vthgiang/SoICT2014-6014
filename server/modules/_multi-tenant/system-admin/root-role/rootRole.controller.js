const RootRoleServices = require('./rootRole.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllRootRoles = async (req, res) => {
    try {
        const roleDefaults = await RootRoleServices.getAllRootRoles();

        LogInfo(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_root_roles_success'],
            content: roleDefaults
        });
    } catch (error) {
        LogError(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_root_roles_faile'],
            content: error
        });
    }
};
