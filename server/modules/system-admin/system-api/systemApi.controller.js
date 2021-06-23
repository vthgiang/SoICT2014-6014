const { SystemApiServices } = require('./systemApi.service');
const Logger = require(`../../../logs`);

const getSystemApis = async (req, res) => {
    try {
        const data = await SystemApiServices.getSystemApis(req.query);
        
        Logger.info(req.user.email, 'get system api');
        res.status(200).json({
            success: true,
            messages: ['get_system_api_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'get system api');
       
        res.status(400).json({
            success: false,
            messages: ['get_system_api_failure'],
            content: error
        });
    }
};

const createSystemApi = async (req, res) => {
    try {
        const systemAPi = await SystemApiServices.createSystemApi(req.body);
        
        Logger.info(req.user.email, 'create system api');
        res.status(200).json({
            success: true,
            messages: ['create_system_api_success'],
            content: systemAPi
        });
    } catch (error) {
        Logger.error(req.user.email, 'create system api');
        let messages = error?.messages === 'system_api_exist' ? ['system_api_exist'] : ['create_system_api_failure']
       
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        });
    }
};

const updateSystemApiAutomatic = async (app, req, res) => {
    try {
        const systemAPi = await SystemApiServices.updateSystemApiAutomatic(app);
        
        Logger.info(req.user.email, 'create system api');
        res.status(200).json({
            success: true,
            messages: ['create_system_api_success'],
            content: systemAPi
        });
    } catch (error) {
        Logger.error(req.user.email, 'create system api');
        res.status(400).json({
            success: false,
            messages: ['create_system_api_failure'],
            content: error
        });
    }
}

const createPrivilegeApi = async (req, res) => {
    try {
        const privilegeApi = await SystemApiServices.createPrivilegeApi(req.body);
        
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

exports.SystemApiControllers = {
    getSystemApis,
    createSystemApi,
    updateSystemApiAutomatic,
    createPrivilegeApi
}
