const AuthService = require('./auth.service');
const { LogInfo, LogError } = require('../../logs');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.header('fingerprint'), req.body);

        await LogInfo(loginUser.user.email, 'LOGIN', loginUser.user.company);
        res.status(200).json({
            success: true,
            message: 'login_success',
            content: loginUser
        });
    } catch (error) {

        await LogError(req.body.email, 'LOGIN');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req.user._id, req.token);

        await LogInfo(req.user.email, 'LOG_OUT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'logout_success',
            content: logout
        });
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        var logout = await AuthService.logoutAllAccount(req.user._id);
        
        await LogInfo(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'logout_all_success',
            content: logout
        });
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        var forgotPassword = await AuthService.forgotPassword(req.body.email);

        await LogInfo(req.body.email, 'FORGOT_PASSWORD');
        res.status(200).json({
            success: true,
            message: 'request_forgot_password_success',
            content: forgotPassword
        });
    } catch (error) {

        await LogError(req.body.email, 'FORGOT_PASSWORD');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        var resetPassword = await AuthService.resetPassword(req.body.otp, req.body.email, req.body.password);

        await LogInfo(req.body.email, 'RESET_PASSWORD');
        res.status(200).json({
            success: true,
            message: 'reset_password_success',
            content: resetPassword
        });
    } catch (error) {

        await LogError(req.body.email, 'RESET_PASSWORD');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.changeInformation = async (req, res) => {
    try {
        var profile = await AuthService.changeInformation(req.params.id, req.body.name);

        await LogInfo(req.user.email, 'CHANGE USER INFORMATION', req.user.company);
        res.status(200).json({
            success: true,
            message: 'change_user_information_success',
            content: profile
        });
    } catch (error) {

        await LogError(req.user.email,'CHANGE USER INFORMATION', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        var user = await AuthService.changePassword(req.params.id, req.body.password, req.body.new_password);

        await LogInfo(req.user.email, 'CHANGE USER PASSWORD', req.user.company);
        res.status(200).json({
            success: true,
            message: 'change_user_password',
            content: user
        });
    } catch (error) {

        await LogError(req.user.email,'CHANGE USER PASSWORD', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getLinksOfRole = async (req, res) => {
    try {
        var data = await AuthService.getLinksOfRole(req.params.id);

        await LogInfo(req.user.email,'GET_LINKS_OF_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_links_of_role_success',
            content: data
        });
    } catch (error) {

        await LogError(req.user.email,'GET_LINKS_OF_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        var profile = await AuthService.show(req.params.id);

        await LogInfo(req.user.email, 'SHOW_PROFILE', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_profile_success',
            content: profile
        });
    } catch (error) {

        await LogError(req.user.email, 'SHOW_PROFILE');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

 