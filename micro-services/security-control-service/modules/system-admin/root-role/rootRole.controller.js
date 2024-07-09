const RootRoleServices = require('./rootRole.service');
const Logger = require(`../../../logs`);

exports.getAllRootRoles = async (req, res) => {
    try {
        const roleDefaults = await RootRoleServices.getAllRootRoles();

        Logger.info(req.user.email, 'get_root_roles_success');
        res.status(200).json({
            success: true,
            messages: ['get_root_roles_success'],
            content: roleDefaults
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_root_roles_failure');
        res.status(400).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_root_roles_failure'],
            content: error
        });
    }
};
