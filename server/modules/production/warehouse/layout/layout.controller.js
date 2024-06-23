const LayoutService = require('./layout.service');
const Logger = require('../../../../logs');

exports.getAllLayouts = async (req, res) => {
    try {
        const layouts = await LayoutService.getAllLayouts('vnist');
        // await Logger.info(req.user.email, 'GET_STOCKS', req.portal);
        res.status(200).json(layouts)
    }
    catch(error){
        // await Logger.error(req.user.email, 'GET_STOCKS', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_layout_failed'],
            content: error.message
        })
    }
}
