const { LogInfo, LogError } = require('../../../../logs');
const DashboardOrganizationalUnitService = require('./dashboard.service');

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
exports.getAllChildTargetOfOrganizationalUnitKpis = async (req, res) => {
    try {
        var childTargets = await DashboardOrganizationalUnitService.getAllChildTargetOfOrganizationalUnitKpis(req.params.id);
        LogInfo(req.user.email, ' get all child target of organizational unit kpis ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTargets
        });
    } catch (error) {
        LogError(req.user.email, ' get all child target of organizational unit kpis ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_fail'],
            content: error
        })
    }
}

/** Lấy tất cả task của organizationalUnit hiện tại (chỉ lấy phần evaluations của tháng hiện tại) */
exports.getAllTaskOfOrganizationalUnit = async (req, res) => {
    try {
        var tasks = await DashboardOrganizationalUnitService.getAllTaskOfOrganizationalUnit(req.params.id);
        LogInfo(req.user.email, ' get all task of organizational unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: tasks
        })
    } catch (error) {
        LogError(req.user.email, ' get all task of organizational unit ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: error
        })
    }
}