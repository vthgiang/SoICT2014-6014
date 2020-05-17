const managerService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');
// Điều phối đến các hàm dịch vụ cơ sở dữ liệu của module quản lý kpi đơn vị
// get all target of unit kpi
exports.get =async (req, res) => {
   try {
       console.log(req.params.id);
        var kpiunits = await managerService.get(req.params.id);
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

exports.getKPIUnits = async (req, res) => {
    try {
        const kpiunits = await managerService.getKPIUnits(req.params);
        await LogInfo(req.user.email, `Get kpi units`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['search_kpi_units_success'],
            content: kpiunits
        });
    } catch (error) {
        await LogError(req.user.email, `Get kpi units`, req.user.company);
        res.status(400).json({
            messages: ['search_kpi_units_fail'],
            content: error
        });
    }
};

// Lấy tất cả các mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId =async (req, res) => {
    try {
        var childTarget = await managerService.getChildTargetByParentId(req.params.id);
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

// Cập nhật dữ liệu mới nhất cho KPI đơn vị
exports.evaluateKPI =async (req, res) => {
    try {
        var kpiunit = await managerService.evaluateKPI(req.params.id);
        LogInfo(req.user.email, ' evaluate kpi unit ',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['update_evaluate_kpi_unit_success'],
            kpiunit: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, ' evaluate kpi unit ',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['update_evaluate_kpi_unit_fail'],
            content: error
        })
    }
}