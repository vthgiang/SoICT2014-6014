const SystemService = require('./system.service');

exports.getLogState = async (req, res) => {
    try {
        const logState = await SystemService.getLogState();
        
        res.status(200).json(logState);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.toggleLogState = async (req, res) => {
    try {
        const action = await SystemService.toggleLogState();
        console.log("LOG STATE: ", isLog);
        res.status(200).json(action);
    } catch (error) {
        
        res.status(400).json(error);
    }
};