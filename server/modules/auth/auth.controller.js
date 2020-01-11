const AuthService = require('./auth.service');
const { authLogger } = require('../../logs');
const requestIp = require('request-ip');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.body);
        
        const clientIp = requestIp.getClientIp(req); 
        console.log("IP address: ", clientIp);

        
        if(isLog) authLogger.info("Login :" + req.body.email);
        res.header('auth-token', loginUser.token).status(200).json(loginUser);
    } catch (error) {

        if(isLog) authLogger.error("Login :" + req.body.email);
        res.status(400).json(error);
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req.user._id, req.token);
        if(isLog) authLogger.info("Logout :" + req.user.email);
        res.status(200).json(logout);
    } catch (error) {
        if(isLog) authLogger.error("Logout :" + req.user.email);
        res.status(400).json(error);
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        var logout = await AuthService.logoutAllAccount(req.user._id);
        if(isLog) authLogger.info("LogoutAllAccount :" + req.user.email);
        res.status(200).json(logout);
    } catch (error) {
        if(isLog) authLogger.error("LogoutAllAccount :" + req.user.email);
        res.status(400).json(error);
    }
};

 