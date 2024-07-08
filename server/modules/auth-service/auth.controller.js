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

exports.revokeToken = async (req, res) => {
    try {
        const service = await AuthService.revokeToken(req.portal, req.user._id, req.token);

        await Logger.info(req.user.email, 'revoke_token_suscess', req.portal);
        res.status(200).json({
            success: true,
            messages: ['revoke_token_success'],
            content: {}
        });
    } catch (error) {
        console.log('errorLogOut', error)
        await Logger.error(req.user.email, 'revoke_token_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['revoke_token_faile'],
            content: error
        });
    }
};

exports.revokeAllToken = async (req, res) => {
    try {
        const service = await AuthService.revokeAllToken(req.portal, req.user._id, req.token);

        await Logger.info(req.user.email, 'revoke_all_token_suscess', req.portal);
        res.status(200).json({
            success: true,
            messages: ['revoke_all_token_success'],
            content: {}
        });
    } catch (error) {
        console.log('errorLogOut', error)
        await Logger.error(req.user.email, 'revoke_all_token_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['revoke_all_token_faile'],
            content: error
        });
    }
};
