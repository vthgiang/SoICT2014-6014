const GoodService = require('./good.service');
const { LogInfo, LogError } = require(SERVER_LOGS_DIR);

exports.getGoodsByType = async (req, res) => {
    try {
        const goodsByType = await GoodService.getGoodsByType(req.user.company._id, req.query);
        LogInfo(req.user.email, 'GET_GOOS_BY_TYPE_SUCCESS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_good_success'],
            content: goodsByType
        });
    }catch(error) {
        LogError(req.user.email, 'GET_GOODS_BY_TYPE_FAILED', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_good_failed'],
            content: error
        });
    }
}