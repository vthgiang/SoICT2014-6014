const { LogInfo, LogError } = require('../../../../logs');
const DashboardOrganizationalUnitService = require('./dashboard.service');

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
exports.getChildTargetOfOrganizationalUnitKpis =async (req, res) => {
    try {
        var childTargets = await DashboardOrganizationalUnitService.getChildTargetOfOrganizationalUnitKpis(req.params.id);
        LogInfo(req.user.email, ' get child target by parent id ',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTargets
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
