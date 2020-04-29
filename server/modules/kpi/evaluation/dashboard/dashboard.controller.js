const DashboardKPIMemberService = require('./dashboard.service');
const { LogInfo, LogError } = require('../../../../logs');

// get all target of member kpi
exports.getKPIAllMember = async (req, res) => {
    try {
        const kpimembers = await DashboardKPIMemberService.getKPIAllMember(req.params);
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

// get all target of member kpi
exports.getByMember = async (req, res) => {
    try {
        // console.log("id member", req.params.member)
        const kpimembers = await DashboardKPIMemberService.getByMember(req.params.member);
        await LogInfo(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_targets_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(400).json({
            messages: ['get_kpi_targets_fail'],
            message: error
        });
    }
};
