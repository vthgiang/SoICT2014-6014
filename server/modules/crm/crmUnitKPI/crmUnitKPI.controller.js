const CrmUnitKPIService = require('./crmUnitKPI.service');
const Logger = require(`../../../logs`);
/**
 * Các controller cho phần Quản lý khách hàng/ Cấu hình hoạt động chăm sóc khách hàng/Chỉ tiêu đơn vị chăm sóc khách hàng
 */
exports.getCrmUnitKPI = async (req, res) => {
    try {
        const crmUnitKPI = await CrmUnitKPIService.getCrmUnitKPI(req.portal, req.user.company._id, req.user._id, req.currentRole);
        await Logger.info(req.user.email, ' get_crmUnitKPI_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_crmUnitKPI_success'],
            content: crmUnitKPI
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_crmUnitKPI_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_crmUnitKPI_faile'],
            content: error
        })
    }
}

exports.editCrmUnitKPI = async (req, res) => {
    try {
        const crmUnitKPI = await CrmUnitKPIService.editCrmUnitKPI(req.portal, req.user.company._id, req.params.id, req.body, req.user._id);
        await Logger.info(req.user.email, ' edit_crmUnitKPI_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_crmUnitKPI_success'],
            content: crmUnitKPI
        })
    } catch (error) {
        await Logger.error(req.user.email, ' edit_crmUnitKPI_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_crmUnitKPI_faile'],
            content: error
        })
    }
}

