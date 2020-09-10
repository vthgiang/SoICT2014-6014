const managerService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');


/**
 * lấy tất cả kpi đơn vị
 * @param {*} req 
 * @param {*} res 
 */
exports.copyKPI = async (req, res) => {
    try {
        var kpiunit = await managerService.copyKPI(req.params.id, req.query);
        LogInfo(req.user.email, ' copy kpi unit ',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['copy_kpi_unit_success'],
            content: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, ' copy kpi unit ',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['copy_kpi_unit_fail'],
            content: error
        })
    }
}