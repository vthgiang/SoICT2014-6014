const KPIMemberService = require('./employeeEvaluation.service');
const { LogInfo, LogError } = require('../../../../logs');
// get all target of member kpi
exports.getKPIAllMember = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKPIAllMember(req.params);
        await LogInfo(req.user.emai, `Get kpi all member`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.emai, `Get kpi all  member`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            content: error
        });
    }
};
// get all target of member kpi
exports.getByMember = async (req, res) => {
    try {
        // console.log("id member", req.params.member)
        const kpimembers = await KPIMemberService.getByMember(req.params.member);
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

// get target of personal kpi by id req.params.id
exports.getById = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getById(req.params.id);
        await LogInfo(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_by_id_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_by_id_fail'],
            message: error
        });
    }
}

// Lấy KPI cá nhân theo tháng  creater: req.params.id, time: month
exports.getByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getByMonth(req.params);
        await LogInfo(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_by_month_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_by_month_fail'],
            message: error
        });
    }
};

// Phê duyệt tất cả mục tiêu của KPI req.params.id
exports.approveAllTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.approveAllTarget(req.params.id);
        await LogInfo(req.user.email, `Approve all target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['approve_all_kpi_target_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Approve all target`, req.user.company);
        res.status(400).json({
            messages: ['approve_all_kpi_target_fail'],
            message: error
        });
    }
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editTarget(req.params.id, req.body);
        await LogInfo(req.user.email, `Edit target member`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_kpi_target_member_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Edit target member`, req.user.company);
        res.status(400).json({
            messages: ['edit_kpi_target_member_fail'],
            message: error
        });
    }
}

// Phê duyệt từng mục tiêu của KPI req.params.id  status: req.params.status
exports.editStatusTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editStatusTarget(req.params.id);
        await LogInfo(req.user.email, `Edit status target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_status_target_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Edit status target`, req.user.company);
        res.status(400).json({
            messages: ['edit_status_target_fail'],
            message: error
        });
    }
}

exports.getTaskById= async(req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTaskById(req.params.id);
        await LogInfo(req.user.email, `Get task by Id`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get task by Id`, req.user.company);
        res.status(400).json({
            messages: ['get_task_by_id_fail'],
            message: error
        });
    } 
}
exports.getSystemPoint= async(req, res) => {
    try {
        const kpimembers = await KPIMemberService.getSystemPoint(req.params.id);
        await LogInfo(req.user.email, `Get system point`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_system_point_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogError(req.user.email, `Get system point`, req.user.company);
        res.status(400).json({
            messages: ['get_system_point_fail'],
            message: error
        });
    }
}

// cập nhật điểm quản lí đánh giá
exports.setPointKPI = async (req, res) =>{
    try {
        const kpimembers = await KPIMemberService.setPointKPI(req.params.id_kpi, req.params.id_target, req.body);
        await LogInfo(req.user.email, `Set point for kpi`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['set_point_kpi_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogInfo(req.user.email, `Set point for kpi`, req.user.company);
        res.status(400).json({
            messages: ['set_point_kpi_fail'],
            message: error
        });
    }
}