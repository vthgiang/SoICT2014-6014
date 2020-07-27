const managerService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');
// Điều phối đến các hàm dịch vụ cơ sở dữ liệu của module quản lý kpi đơn vị
// get all target of unit kpi

/**
 * lấy tất cả kpi đơn vị
 * @param {*} req 
 * @param {*} res 
 */
exports.get =async (req, res) => {
   try {
        var kpiunits = await managerService.getKPIUnits(req.query);
        LogInfo(req.user.email, ' get kpi unit ',req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_unit_success'],
            content: kpiunits
        })
    } catch (error) {
        LogError(req.user.email, ' get kpi unit ',req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_kpi_unit_fail'],
            content: error
        })
    }

};


// Lấy tất cả các mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId =async (req, res) => {
    try {
        var childTarget = await managerService.getChildTargetByParentId(req.params, req.query);
        LogInfo(req.user.email, ' get child target by parent id ',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTarget
        });
    } catch (error) {
        LogError(req.user.email, ' get child target by parent id ',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_fail'],
            content: error
        })
    }

}

exports.copyKPI =async (req, res) => {
    try {
        var kpiunit = await managerService.copyKPI(req.params.kpiId, req.query);
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