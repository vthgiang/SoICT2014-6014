const SystemService = require('./log.service');
const { LogInfo, LogError } = require('../../../logs');

exports.getLogState = async (req, res) => {
    try {
        const logState = await SystemService.getLogState();
        
        await LogInfo(req.user.email, 'GET_LOG_STATE', req.user.company._id);
        res.status(200).json(logState);
    } catch (error) {
        
        await LogError(req.user.email, 'GET_LOG_STATE', req.user.company._id);
        res.status(400).json(error);
    }
};

exports.toggleLogState = async (req, res) => {
    try {
        const action = await SystemService.toggleLogState();
        
        await LogInfo(req.user.email, 'TOGGLE_LOG_STATE', req.user.company._id);
        res.status(200).json(action);
    } catch (error) {
        
        await LogError(req.user.email, 'TOGGLE_LOG_STATE', req.user.company._id);
        res.status(400).json(error);
    }
};