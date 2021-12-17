const AssetLotService = require('./asset-lot.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);

/**
 * Lấy danh sách lô tài sản */
exports.searchAssetLots = async (req, res) => {
    try {
        let data;
        let params = {
            code: req.query.code,
            assetLotName: req.query.assetLotName,
            assetType: req.query.assetType,
            group: req.query.group,
            supplier: req.query.supplier,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }

        data = await AssetLotService.searchAssetLots(req.portal, params);
        await Logger.info(req.user.email, 'GET_ASSET_LOTS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_asset_lot_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ASSET_LOTS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_list_asset_lot_false"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm mới thông tin tài sản
 */
exports.createAssetLot = async (req, res) => {
    try {
        let file = req.files && req.files.file;
        let fileInfo = { file };

        let data = await AssetLotService.createAssetLot(req.portal, req.user.company._id, req.body, fileInfo);
        await Logger.info(req.user.email, 'CREATE_ASSET_LOT', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_asset_lot_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error);
        let messages = error && error.messages === 'asset_code_lot_exist' ? ['asset_code_lot_exist'] : ['create_asset_lot_failed'];

        await Logger.error(req.user.email, 'CREATE_ASSET_LOT', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.assetLotCodeError
        });
    }
}

/**
 * Cập nhật thông tin lô tài sản
 */
exports.updateAssetLot = async (req, res) => {
    try {
        let file = req.files && req.files.file;
        let fileInfo = { file };

        let data = await AssetLotService.updateAssetLot(req.portal, req.user.company._id, req.user._id, req.params.id, req.body, fileInfo);
        await Logger.info(req.user.email, 'UPDATE_ASSET_LOT', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_asset_lot_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error);
        let messages = error && error.messages === 'asset_code_lot_exist' ? ['asset_code_lot_exist'] : ['update_asset_lot_failed'];

        await Logger.error(req.user.email, 'UPDATE_ASSET_LOT', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.assetCodeError
        });
    }
}

/**
 * Xóa lô tài sản
 */
exports.deleteAssetLots = async (req, res) => {
    try {
        let data = await AssetLotService.deleteAssetLots(req.portal, req.body.assetLotIds);
        res.status(200).json({
            success: true,
            messages: ["delete_asset_lot_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_asset_lot_false"],
            content: { error: error }
        });
    }
}

/**
 * Lấy thông tin 1 lô tài sản
 */
exports.getAssetLotInforById = async (req, res) => {
    try {
        let data;
        data = await AssetLotService.getAssetLotInforById(req.portal, req.params.id);
        await Logger.info(req.user.email, 'GET_ASSET_LOT_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_asset_lot_by_id_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ASSET_LOT_BY_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_asset_lot_by_id_false"],
            content: {
                error: error
            }
        });
    }
}