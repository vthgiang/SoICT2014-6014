const Log = require(`../../../../logs`);
const RequestService = require('./productRequestManagement.service');

exports.createRequest = async (req, res) => {
    try {
        let data = req.body;
        let request = await RequestService.createRequest(req.user, data, req.portal);

        await Log.info(req.user.email, "CREATE_REQUEST", req.portal);

        res.status(210).json({
            success: true,
            messages: ["create_successfully"],
            content: request
        });
    } catch (error) {
        console.log(error.message);
        await Log.error(req.user.email, "CREATE_REQUEST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        })
    }
}

exports.getAllRequestByCondition = async (req, res) => {
    try {

        let query = req.query;
        let requests = await RequestService.getAllRequestByCondition(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_REQUEST", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: requests
        })

    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_REQUEST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        })
    }
}

exports.getRequestById = async (req, res) => {
    try {
        let id = req.params.id;
        let request = await RequestService.getRequestById(id, req.portal);

        await Log.info(req.user.email, "GET_REQUEST_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_detail_successfully"],
            content: request
        })
    } catch (error) {
        await Log.error(req.user.email, "GET_REQUEST_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_detail_failed"],
            content: error.message
        })
    }
}

exports.editRequest = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;

        let request = await RequestService.editRequest(req.user, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_REQUEST", req.portal);

        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: request
        })
    } catch (error) {
        await Log.error(req.user.email, "EDIT_REQUEST", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        })
    }
}

exports.getNumberRequest = async (req, res) => {
    try {
        let query = req.query;

        let purchasingNumber = await RequestService.getNumberRequest(query, req.portal);

        await Log.info(req.user.email, "GET_NUMBER_REQUEST", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_number_successfully"],
            content: purchasingNumber
        })
    } catch (error) {
        await Log.error(req.user.email, "GET_NUMBER_REQUEST", req.portal);
        console.log(error.message)
        res.status(400).json({
            success: false,
            messages: ["get_number_failed"],
            content: error.message
        })
    }
}
