const { SystemApiServices } = require('./systemApi.service');
const Logger = require(`../../../../logs`);
const fs = require('fs').promises;

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
        Logger.error(req.user.email, 'get system api');

        res.status(400).json({
            success: false,
            messages: ['get_system_api_failure'],
            content: error
        });
    }
};

const getSystemApisUpdateLog = async (req, res) => {
    try {
        const updateApiLogText = await fs.readFile('middleware/systemApiChangedLog.log', 'utf8');
        console.log(updateApiLogText);
        updateApiLog = JSON.parse(updateApiLogText);

        Logger.info(req.user.email, 'get system api update log');
        res.status(200).json({
            success: true,
            messages: ['get_system_api_update_log_success'],
            content: updateApiLog
        });
    } catch (error) {
        Logger.error(req.user.email, 'get system api update log');

        res.status(400).json({
            success: false,
            messages: ['get_system_api_update_log_failure'],
            content: error
        });
    }
};

/** Them moi system API */
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

/** Chinh sua API */
const editSystemApi = async (req, res) => {
    try {
        const systemApi = await SystemApiServices.editSystemApi(req.params.id, req.body);

        Logger.info(req.user.email, 'edit system api');
        res.status(200).json({
            success: true,
            messages: ['edit_system_api_success'],
            content: systemApi
        });
    } catch (error) {
        Logger.error(req.user.email, 'edit system api');
        res.status(400).json({
            success: false,
            messages: ['edit_system_api_failure'],
            content: error
        });
    }
}

/** Xoa system API */
const deleteSystemApi = async (req, res) => {
    try {
        const systemApi = await SystemApiServices.deleteSystemApi(req.params.id);

        Logger.info(req.user.email, 'delete system api');
        res.status(200).json({
            success: true,
            messages: ['delete_system_api_success'],
            content: systemApi
        });
    } catch (error) {
        Logger.error(req.user.email, 'delete system api');
        res.status(400).json({
            success: false,
            messages: ['delete_system_api_failure'],
            content: error
        });
    }
}

const updateSystemApi = async (app, req, res) => {
    try {
        const content = await SystemApiServices.updateSystemApi(app);

        Logger.info(req.user.email, 'update system api');
        res.status(200).json({
            success: true,
            messages: ['update_system_api_success'],
            content
        });
    } catch (error) {
        Logger.error(req.user.email, 'update system api');
        res.status(400).json({
            success: false,
            messages: ['update_system_api_failure'],
            content: error
        });
    }
}

exports.SystemApiControllers = {
    getSystemApis,
    createSystemApi,
    editSystemApi,
    deleteSystemApi,
    updateSystemApi,
    getSystemApisUpdateLog,
}
