const ApiService = require('./api.service');
const Logger = require(`../../../logs`);

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
        console.log(error)
        await Logger.error(req.user.email, 'get apis failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_apis_failure'],
            content: error
        });
    }
};

exports.getApiRegistration = async (req, res) => {
    try {
        let data = await ApiService.getApiRegistration(req.user?.company?._id, req.query);

        console.log(data)
        await Logger.info(req.user.email, 'get api registration success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_api_registration_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'get api registration failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_api_registration_failure'],
            content: error
        });
    }
};

exports.registerToUseApi = async (req, res) => {
    try {
        let data = {
            ...req.body,
            companyId: req.user?.company?._id
        }
        let privilegeApi = await ApiService.registerToUseApi(data);

        await Logger.info(req.user.email, 'get apis success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_apis_success'],
            content: privilegeApi
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