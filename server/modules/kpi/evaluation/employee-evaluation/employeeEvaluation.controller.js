const KPIMemberService = require('./employeeEvaluation.service');
const { LogInfo, LogError } = require('../../../../logs');
const { countDocuments } = require('../../../../models/auth/role.model');

/**
 * lấy tất cả kpi nhân viên
 */
exports.getEmployeeKPISets = async (req, res) => {
    if (req.query.userId && req.query.date){
        getKpisByMonth(req, res);
    }
    else{
        try {
        const kpimembers = await KPIMemberService.getEmployeeKPISets(req.query);
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
    }
};

/**
 * Lấy kpi cá nhân theo id 
 */
exports.getKpisByKpiSetId = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpisByKpiSetId(req.params.id);
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

/**
 * Lấy KPI cá nhân theo tháng 
 */
getKpisByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpisByMonth(req.query);
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

/**
 * Phê duyệt tất cả mục tiêu của KPI req.params.id
 */
exports.approveAllKpis = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.approveAllKpis(req.params.id);
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

/**
 * Chỉnh sửa mục tiêu của kpi cá nhân
 */
exports.editKpi = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editKpi(req.params.id, req.body);
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

/**
 * Phê duyệt từng mục tiêu của KPI req.params.id  status: req.params.status
 */
exports.editStatusKpi = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editStatusKpi(req.params, req.query);
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
/**
 * Lấy danh sách công việc theo id
 */
exports.getTasksByKpiId = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTasksByKpiId(req.query);
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
/**
 * cập nhật điểm level
 */
exports.setTaskImportanceLevel = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.setTaskImportanceLevel(req.params.id, req.query.kpiType, req.body);
        await LogInfo(req.user.email, `Set task importance level`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['set_task_importance_level_success'],
            content: kpimembers
        });
    } catch (error) {
        await LogInfo(req.user.email, `Set point for kpi`, req.user.company);
        res.status(400).json({
            messages: ['set_task_importance_level_fail'],
            message: error
        });
    }
}
