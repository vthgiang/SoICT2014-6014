const SuppliesService = require('./supplies.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);

/**
 * Lấy danh sách vật tư tiêu hao
 */
exports.searchSupplies = async (req, res) => {
    try {
        let data;
        let params = {
            code: req.query.code,
            suppliesName: req.query.suppliesName,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await SuppliesService.searchSupplies(req.portal, params);
        await Logger.info(req.user.email, 'SEARCH_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["search_supplies_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'SEARCH_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: ["search_supplies_failed"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm vật tư tiêu hao
 */
 exports.createSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.createSupplies(req.portal, req.user.company._id, req.body);
        await Logger.info(req.user.email, 'CREATE_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_supplies_success"],
            content: data
        });
    } catch (error) {
        let messages = error && error.messages === 'supplies_code_exist' ? ['supplies_code_exist'] : ['create_supplies_failed'];

        await Logger.error(req.user.email, 'CREATE_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.suppliesCodeError
        });
    }
}

/**
 * Cập nhật thông tin vật tư tiêu hao
 */
 exports.updateSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.updateSupplies(req.portal, req.user.company._id, req.params.id, req.body);
        await Logger.info(req.user.email, 'UPDATE_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_supplies_success"],
            content: data
        });
    } catch (error) {
        let messages = error && error.messages === 'supplies_code_exist' ? ['supplies_code_exist'] : ['update_supplies_failed'];

        await Logger.error(req.user.email, 'UPDATE_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.suppliesCodeError
        });
    }
}

/**
 * Xóa danh sách vật tư tiêu hao
 */
 exports.deleteSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.deleteSupplies(req.portal, req.body.ids);
        res.status(200).json({
            success: true,
            messages: ["delete_supplies_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_supplies_failed"],
            content: { error: error }
        });
    }
}

/**
 * Lấy thông tin vật tư tiêu hao theo id
 */
 exports.getSuppliesById = async (req, res) => {
    try {
        let data;
        data = await AssetLotService.getAssetLotInforById(req.portal, req.params.id);
        await Logger.info(req.user.email, 'GET_SUPPLIES_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_supplies_by_id_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_SUPPLIES_BY_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_supplies_by_id_failed"],
            content: {
                error: error
            }
        });
    }
}