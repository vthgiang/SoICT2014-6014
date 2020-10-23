const LotService = require('./inventory.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

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
    catch(error) {
        await Logger.error(req.user.email, 'GET_LOT_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_lot_failed'],
            content: error
        })
    }
}