const { SystemApiPrivilegeServices } = require('./privilegeSystemApi.service');
const Logger = require(`../../../../../logs`);

const createPrivilegeApi = async (req, res) => {
    try {
        const privilegeApi = await SystemApiPrivilegeServices.createPrivilegeApi(req.body);
        
        Logger.info(req.user.email, 'create privilege api');
        res.status(200).json({
            success: true,
            messages: ['create_privilege_api_success'],
            content: privilegeApi
        });
    } catch (error) {
        Logger.error(req.user.email, 'create privilege api');
        res.status(400).json({
            success: false,
            messages: ['create_privilege_api_failure'],
            content: error
        });
    }
}

exports.SystemApiPrivilegeControllers = {
    createPrivilegeApi
}
