const CrmUnitService = require('./crmUnit.service');
const Logger = require(`../../../logs`);

/**
 * Các controller cho phần Quản lý khách hàng/ Cấu hình đơn vị chăm sóc khách hàng
 */
/**
 * Lấy thông tin tất cả 
 * @param {*} req 
 * @param {*} res 
 */
exports.getCrmUnits = async (req, res) => {
    try {
        const CrmUnits = await CrmUnitService.getCrmUnits(req.portal, req.user.company._id, req.query);
        await Logger.info(req.user.email, ' get_CrmUnit_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_CrmUnit_success'],
            content: CrmUnits
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_CrmUnit_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_CrmUnit_faile'],
            content: error
        })
    }
}


/**
 * Tạo mới 
 * @param {*} req 
 * @param {*} res 
 */
exports.createCrmUnit = async (req, res) => {
    try {
        const newCrmUnit = await CrmUnitService.createCrmUnit(req.portal, req.user.company._id, req.user._id, req.body);
        await Logger.info(req.user.email, ' create_CrmUnit_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_CrmUnit_success'],
            content: newCrmUnit
        })
    } catch (error) {
        await Logger.error(req.user.email, ' create_CrmUnit_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_CrmUnit_faile'],
            content: error
        })
    }
}



/**
 * Xóa 
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCrmUnit = async (req, res) => {
    try {
        const deleteCrmUnit = await CrmUnitService.deleteCrmUnit(req.portal, req.user.company._id, req.params.id);
        await Logger.info(req.user.email, ' delete_CrmUnit_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_CrmUnit_success'],
            content: deleteCrmUnit
        })
    } catch (error) {
        await Logger.error(req.user.email, ' delete_CrmUnit_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_CrmUnit_faile'],
            content: error
        })
    }
}