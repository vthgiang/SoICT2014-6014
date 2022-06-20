const { SystemPageServices } = require('./systemPage.service');
const Log = require(`../../../logs`);

const getPageApis = async (req, res) => {
    try{
        const pageApis = await SystemPageServices.getSystemPageApis(req.query);

        Log.info(req.user.email, `get page ${req.query.pageUrl} apis`);

        res.status(200).json({
            success: true,
            messages: [`Get page ${req.query.pageUrl} apis successfully`],
            content: {
                pageApis,
            }
        });
    } catch(error) {
        Log.error(req.user.email, `get page ${req.query.pageUrl} apis`);

        res.status(400).json({
            success: false,
            messages: [`Get page ${req.query.pageUrl} apis failed`],
            content: error
        });
    }
}

const getSystemAdminPage = async (req, res) => {
    try {
        data = await SystemPageServices.getSystemAdminPage(req.query);

        res.status(200).json({
            success: true,
            messages: ["Get system admin page successfully"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["Get system admin page failed"],
            content: error.message
        });
    }
}

const addSystemAdminPage = async (req, res) => {
    console.log("reqssss", req.res.req.currentRole);
    try {
        let pageURL = await SystemPageServices.addSystemAdminPage(req.body, req.res.req.currentRole);

        res.status(200).json({
            success: true,
            messages: [`Add system admin page successfully`],
            content: pageURL
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Add system admin page failed'],
            content: error.message
        });
    }
}
const deleteSystemAdminPage = async (req, res) => {
    try {
        let deletedPage = await SystemPageServices.deleteSystemAdminPage(req.body.exampleIds);
        if (deletedPage) {
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedPage
            });
        } else {
            throw Error("Page is invalid");
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

exports.SystemPageControllers = {
    getPageApis,
    addSystemAdminPage,
    getSystemAdminPage,
    deleteSystemAdminPage,
}
