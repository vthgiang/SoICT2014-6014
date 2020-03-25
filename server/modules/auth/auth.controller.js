const AuthService = require('./auth.service');
const { LogInfo, LogError } = require('../../logs');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.header('fingerprint'), req.body);

        await LogInfo(loginUser.user.email, 'LOGIN', loginUser.user.company);
        res.status(200).json(loginUser);
    } catch (error) {

        await LogError(req.body.email, 'LOGIN');
        console.log("Lỗi: ", error);
        res.status(400).json(error);
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req.user._id, req.token);

        await LogInfo(req.user.email, 'LOG_OUT', req.user.company);
        res.status(200).json(logout);
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT', req.user.company);
        res.status(400).json(error);
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        var logout = await AuthService.logoutAllAccount(req.user._id);
        
        await LogInfo(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(200).json(logout);
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(400).json(error);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        var forgotPassword = await AuthService.forgotPassword(req.body.email);

        await LogInfo(req.body.email, 'FORGOT_PASSWORD');
        res.status(200).json(forgotPassword);
    } catch (error) {

        await LogError(req.body.email, 'FORGOT_PASSWORD');
        res.status(400).json(error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        var resetPassword = await AuthService.resetPassword(req.body.otp, req.body.email, req.body.password);

        await LogInfo(req.body.email, 'RESET_PASSWORD');
        res.status(200).json(resetPassword);
    } catch (error) {

        await LogError(req.body.email, 'RESET_PASSWORD');
        res.status(400).json(error);
    }
};

exports.profile = async (req, res) => {
    try {
        var profile = await AuthService.profile(req.params.id);

        await LogInfo(req.user.email, 'GET_PROFILE', req.user.company);
        res.status(200).json(profile);
    } catch (error) {

        await LogError(req.user.email,'GET_PROFILE');
        res.status(400).json(error);
    }
};

exports.getLinksOfRole = async (req, res) => {
    // try {
    //     var data = await AuthService.getLinksOfRole(req.params.id);

    //     await LogInfo(req.user.email,, 'GET_LINKS_OF_ROLE', req.user.company);
    //     res.status(200).json(loginUser);
    // } catch (error) {

    //     await LogError(req.user.email,, 'GET_LINKS_OF_ROLE');
    //     console.log("Lỗi: ", error);
    //     res.status(400).json(error);
    // }
};

 