const AuthService = require('./auth.service');
const { authLogger } = require('../../logs');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.header('browser-finger'), req.body);
        if(isLog) authLogger.info("Login :" + req.body.email);
        res.cookie('jwt', loginUser.token).status(200).json(loginUser);
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

exports.forgotPassword = async (req, res) => {
    try {
        var forgotPassword = await AuthService.forgotPassword(req.body.email);
        if(isLog) authLogger.info("Forgot Password :" + req.body.email);
        res.status(200).json(forgotPassword);
    } catch (error) {
        if(isLog) authLogger.error("Forgot Password :" + req.body.email);
        res.status(400).json(error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        var resetPassword = await AuthService.resetPassword(req.body.otp, req.body.email, req.body.password);
        if(isLog) authLogger.info("Reset Password :" + req.body.email);
        res.status(200).json(resetPassword);
    } catch (error) {
        if(isLog) authLogger.error("Reset Password :" + req.body.email);
        res.status(400).json(error);
    }
};


 