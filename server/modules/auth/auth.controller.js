const AuthService = require('./auth.service');
const { authLogger } = require('../../logs');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.body);
        
        if(isLog) authLogger.info("Login :" + req.body.email);
        res.header('auth-token', loginUser.token).status(200).json(loginUser);
    } catch (error) {

        if(isLog) authLogger.error("Login :" + req.body.email);
        res.status(400).json(error);
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req, res);
        if(isLog) authLogger.info("Logout :" + req.body.email);
        res.status(200).json(logout);
    } catch (error) {
        if(isLog) authLogger.error("Logout :" + req.body.email);
        res.status(400).json(error);
    }
};

 