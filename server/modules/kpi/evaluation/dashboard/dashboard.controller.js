const DashboardKPIMemberService = require('./dashboard.service');
const EmloyeeKpiManagementService = require('../../employee/management/management.service');
const { LogInfo, LogError } = require('../../../../logs');

// get all target of member kpi
exports.getKPIAllMember = async (req, res) => {
    try {
        const kpimembers = await DashboardKPIMemberService.getAllEmpoyeeKpiSetsInOrganizationalUnit(req.params);
        await LogInfo(req.user.email, `Get kpi all member`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get kpi all  member`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            message: error
        });
    }
};
