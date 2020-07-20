const SystemService = require('./log.service');
const { LogInfo, LogError } = require('../../../logs');

exports.getLogState = async (req, res) => {
    try {
        const logState = await SystemService.getLogState();
        
        await LogInfo(req.user.email, 'GET_LOG_STATE');
        res.status(200).json({
            success: true,
            messages: ['get_log_state_successful'],
            content: logState
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_LOG_STATE');
        res.status(400).json({
            success: false,
            messages: ['get_log_state_unsuccessful'],
            content: error
        });
    }
};

exports.toggleLogState = async (req, res) => {
    try {
        const action = await SystemService.toggleLogState();
        
        await LogInfo(req.user.email, 'TOGGLE_LOG_STATE');
        res.status(200).json({
            success: true,
            messages: ['toggle_log_state_successful'],
            content: action
        });
    } catch (error) {
        await LogError(req.user.email, 'TOGGLE_LOG_STATE');
        res.status(400).json({
            success: false,
            messages: ['toggle_log_state_unsuccessful'],
            content: error
        });
    }
};