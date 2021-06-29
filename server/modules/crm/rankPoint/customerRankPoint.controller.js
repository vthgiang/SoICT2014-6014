const CustomerRankPointService = require('./customerRankPoint.service');
const Logger = require(`../../../logs`);

exports.getCustomerRankPoints = async (req, res) => {
    try {
        const customerRankPoints = await CustomerRankPointService.getCustomerRankPoints(req.portal, req.user.company._id, req.query,req.currentRole);
        await Logger.info(req.user.email, ' get_customerRankPoints_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customerRankPoints_success'],
            content: customerRankPoints
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customerRankPoints_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customerRankPoints_faile'],
            content: error
        })
    }
}


exports.getCustomerRankPointById = async (req, res) => {
    try {
        const customerRankPoint = await CustomerRankPointService.getCustomerRankPointById(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' get_customerRankPoint_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customerRankPoint_success'],
            content: customerRankPoint
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customerRankPoint_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customerRankPoint_faile'],
            content: error
        })
    }
}


exports.createCustomerRankPoint = async (req, res) => {
    console.log('vao controller');
    try {
        const newCustomerRankPoint = await CustomerRankPointService.createCustomerRankPoint(req.portal, req.user.company._id, req.body, req.user._id,req.currentRole,req.currentRole);
        await Logger.info(req.user.email, ' create_customerRankPoint_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_customerRankPoint_success'],
            content: newCustomerRankPoint
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_customerRankPoint_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_customerRankPoint_faile'],
            content: error
        })
    }
}


exports.editCustomerRankPoint= async (req, res) => {
    try {
        const customerRankPointUpdate = await CustomerRankPointService.editCustomerRankPoint(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_customerRankPoint_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_customerRankPoint_success'],
            content: customerRankPointUpdate
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_customerRankPoint_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_customerRankPoint_faile'],
            content: error
        })
    }
}


exports.deleteCustomerRankPoint = async (req, res) => {
    try {
        const deleteCustomerRankPoint = CustomerRankPointService.deleteCustomerRankPoint(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_customerRankPoint_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_customerRankPoint_success'],
            content: deleteCustomerRankPoint
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['delete_customerRankPoint_faile'],
            content: error
        })
    }
}
