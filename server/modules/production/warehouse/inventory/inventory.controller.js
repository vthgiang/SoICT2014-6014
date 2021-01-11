const LotService = require('./inventory.service');
const Logger = require(`../../../../logs`);

exports.getAllLots = async (req, res) => {
    try {
        const lots = await LotService.getAllLots(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: lots
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error.message
        })
    }
}

exports.getDetailLot = async (req, res) => {
    try {
        const lot = await LotService.getDetailLot(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_DETAIL_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: lot
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_DETAIL_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error.message
        })
    }
}

exports.editLot = async (req, res) => {
    try {
        let lot = await LotService.editLot(req.params.id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: lot
        })
    }
    catch (err) {
        await Logger.error(req.user.email, 'EDIT_LOT_FAILURE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_faile'],
            content: error.message
        })
    }
}

exports.getLotsByGood = async (req, res) => {
    try {
        const lots = await LotService.getLotsByGood(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: lots
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error.message
        })
    }
}

exports.createOrUpdateLots = async (req, res) => {
    try {
        const lots = await LotService.createOrUpdateLots(req.body, req.portal);

        await Logger.info(req.user.email, 'GET_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: lots
        })
    }
    catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error.message
        })
    }
}

exports.deleteManyLots = async (req, res) => {
    try {
        let lots = await LotService.deleteManyLots(req.body.array, req.portal);

        await Logger.info(req.user.email, 'DELETE_LOTS_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: lots
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'DELETE_LOTS_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_failed'],
            error: error.message
        })
    }
}

exports.createManufacturingLot = async (req, res) => {
    try {
        let data = req.body;
        let lots = await LotService.createManufacturingLot(data, req.portal);

        await Logger.info(req.user.email, 'CREATE_MANUFACTUIRNG_LOT', req.portal);

        res.status(201).json({
            success: true,
            messages: ['create_manufacturing_lot_successfully'],
            content: lots
        })
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_MANUFACTURING_LOT', req.portal);

        res.status(400).json({
            success: false,
            messages: ['create_manufacturing_lot_failed'],
            error: error.message
        });
    }
}

exports.getAllManufacturingLot = async (req, res) => {
    try {
        let query = req.query;

        let lots = await LotService.getAllManufacturingLot(query, req.user, req.portal);

        await Logger.info(req.user.email, 'GET_ALL_MANUFACTURING_LOT', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_successfully'],
            content: lots
        })
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ALL_MANUFACTURING_LOT', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_failed'],
            error: error.message
        })
    }
}

exports.getDetailManufacturingLot = async (req, res) => {
    try {
        let id = req.params.id;

        let lot = await LotService.getDetailManufacturingLot(id, req.portal);

        await Logger.info(req.user.email, 'GET_DETAIL_MANUFACTURING_LOT', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_detail_successfully'],
            content: lot
        })
    } catch (error) {
        await Logger.error(req.user.email, 'GET_DETAIL_MANUFACTURING_LOT', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_detail_failed'],
            error: error.message
        })
    }
}

exports.getInventoryByGoods = async (req, res) => {
    try {
        const invetory = await LotService.getInventoryByGoods(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_INVENTORY_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_inventory_success'],
            content: invetory
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_INVENTORY_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_inventory_failed'],
            error: error.message
        })
    }
}

exports.getInventories = async (req, res) => {
    try {
        const data = await LotService.getInventories(req.query, req.portal);
        await Logger.info(req.user.email, 'GET_LOT_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_lot_success'],
            content: data
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error.message
        })
    }
}