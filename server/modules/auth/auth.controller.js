const AuthService = require('./auth.service');
const { Log } = require('../../logs');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.header('browser-finger'), req.body);

        //isLog && Logger.info(`[LOGIN]` + req.body.email);
        res.cookie('jwt', loginUser.token).status(200).json(loginUser);
    } catch (error) {

        //isLog && Logger.error(`[LOGIN]` + req.body.email);
        res.status(400).json(error);
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req.user._id, req.token);

        //isLog && Logger.info(`[LOGOUT]` + req.body.email);
        res.status(200).json(logout);
    } catch (error) {

        //isLog && Logger.error(`[LOGOUT]` + req.body.email);
        res.status(400).json(error);
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        var logout = await AuthService.logoutAllAccount(req.user._id);
        
        //isLog && Logger.info(`[LOGOUT_ALL_ACCOUNT]` + req.body.email);
        res.status(200).json(logout);
    } catch (error) {

        //isLog && Logger.error(`[LOGOUT_ALL_ACCOUNT]` + req.body.email);
        res.status(400).json(error);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        var forgotPassword = await AuthService.forgotPassword(req.body.email);

        //isLog && Logger.info(`[FORGOT_PASSWORD]` + req.body.email);
        res.status(200).json(forgotPassword);
    } catch (error) {

        //isLog && Logger.error(`[FORGOT_PASSWORD]` + req.body.email);
        res.status(400).json(error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        var resetPassword = await AuthService.resetPassword(req.body.otp, req.body.email, req.body.password);

        //isLog && Logger.error(`[RESET_PASSWORD]` + req.body.email);
        res.status(200).json(resetPassword);
    } catch (error) {

        //isLog && Logger.error(`[RESET_PASSWORD]` + req.body.email);
        res.status(400).json(error);
    }
};


 