const { SystemPageServices } = require('./systemPage.service');
const Logger = require(`../../../logs`);

const getPageApis = async (req, res) => {
    try{
        const pageApis = await SystemPageServices.getSystemPageApis(req.query);

        Logger.info(req.user.email, `get page ${req.query.pageUrl} apis`);

        res.status(200).json({
            success: true,
            messages: [`Get page ${req.query.pageUrl} apis successfully`],
            content: {
                pageApis,
            }
        });
    } catch(error) {
        Logger.error(req.user.email, 'get page ${pageUrl} apis');

        res.status(400).json({
            success: false,
            messages: [`Get page ${req.query.pageUrl} apis failed`],
            content: error
        });
    }
}

exports.SystemPageControllers = {
    getPageApis,
}
