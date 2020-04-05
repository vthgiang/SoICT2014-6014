const RoleDefaultServices = require('./role-default.service');
const {LogInfo, LogError} = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var roleDefaults = await RoleDefaultServices.get();
        LogInfo(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'get_roles_default_success',
            content: roleDefaults
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            message: error
        });
    }
};
