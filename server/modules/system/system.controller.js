const SystemService = require('./system.service');
const { Logger } = require('../../logs');

exports.getLogState = async (req, res) => {
    try {
        const logState = await SystemService.getLogState();
        
        //isLog && Logger.info(`[GET_LOG_STATE]`+req.user.email);
        res.status(200).json(logState);
    } catch (error) {
        
        //isLog && Logger.error(`[GET_LOG_STATE]`+req.user.email);
        res.status(400).json(error);
    }
};

exports.toggleLogState = async (req, res) => {
    try {
        const action = await SystemService.toggleLogState();
        
        //isLog && Logger.info(`[TOGGLE_LOG_STATE]`+req.user.email);
        res.status(200).json(action);
    } catch (error) {
        
        //isLog && Logger.error(`[TOGGLE_LOG_STATE]`+req.user.email);
        res.status(400).json(error);
    }
};