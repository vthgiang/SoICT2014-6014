const SystemService = require('./system.service');
const { Log } = require('../../logs');

exports.getLogState = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET_LOG_STATE');
    try {
        const logState = await SystemService.getLogState();
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(logState);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.toggleLogState = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'TOGGLE_LOG_STATE');
    try {
        const action = await SystemService.toggleLogState();
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(action);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};