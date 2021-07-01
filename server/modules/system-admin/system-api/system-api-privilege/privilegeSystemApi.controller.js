const { SystemApiPrivilegeServices } = require('./privilegeSystemApi.service');
const Logger = require(`../../../../logs`);

const getPrivilegeApis = async (req, res) => {
    try {
        const data = await SystemApiPrivilegeServices.getPrivilegeApis(req.query);
        
        Logger.info(req.user.email, 'get privilege api');
        res.status(200).json({
            success: true,
            messages: ['get_privilege_api_success'],
            content: data
        });
    } catch (error) {
        Logger.error(req.user.email, 'get privilege api');
       
        res.status(400).json({
            success: false,
            messages: ['get_privilege_api_failure'],
            content: error
        });
    }
};


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
        console.log(error)
        let messages = error?.messages === 'company_not_exist' || error?.messages === 'privilege_api_exist' ? [error?.messages] : ['create_privilege_api_failure']

        Logger.error(req.user.email, 'create privilege api');
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        });
    }
}

exports.SystemApiPrivilegeControllers = {
    getPrivilegeApis,
    createPrivilegeApi
}
