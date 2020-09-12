const RootRoleServices = require('./rootRole.service');
const Logger = require(`${SERVER_LOGS_DIR}/_multi-tenant`);

exports.getAllRootRoles = async (req, res) => {
    try {
        const roleDefaults = await RootRoleServices.getAllRootRoles();

        Logger.info(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_root_roles_success'],
            content: roleDefaults
        });
    } catch (error) {
        Logger.error(req.user.email, 'GET_ROLES_DEFAULT');
        res.status(200).json({
            success: true,
            messages: Array.isArray(error) ? error : ['get_root_roles_faile'],
            content: error
        });
    }
};
