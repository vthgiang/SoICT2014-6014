const AuthService = require('./auth.service');
const Logger = require(`../../logs`);
const { decryptMessage } = require('../../helpers/functionHelper');

exports.login = async (req, res) => {
    try {
        const loginService = await AuthService.login(req.body);

        await Logger.info(req.body.email, 'login_success', req.body.portal);
        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: loginService
        });
    } catch (error) {
        console.log('errorLogIn', error)
        await Logger.error(req.body.email, 'login_faile', req.body.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['login_faile'],
            content: error
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const logout = await AuthService.logout(req.portal, req.body.id, req.body.token);

        await Logger.info(req.user.email, 'logout_suscess', req.portal);
        res.status(200).json({
            success: true,
            messages: ['logout_success'],
            content: {}
        });
    } catch (error) {
        console.log('errorLogOut', error)
        await Logger.error(req.user.email, 'logout_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_faile'],
            content: error
        });
    }
};
