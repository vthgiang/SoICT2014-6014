const ApiService = require('../services/api.service');
const Logger = require('../logs');
const {decryptMessage} = require('../helpers/functionHelper');
exports.getApis = async (req, res) => {
    try {
        let apis = await ApiService.getApis(req.portal, req.query);

        await Logger.info(req.user.email, 'get apis success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_apis_success'],
            content: apis
        });
    } catch (error) {
        await Logger.error(req.user.email, 'get apis failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_apis_failure'],
            content: error
        });
    }
};
