const KPIMemberService = require('./employeeEvaluation.service');
const { LogInfo, LogError } = require('../../../../logs');

/**
 * lấy tất cả kpi nhân viên
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * lấy kpi nhân viên theo người tạo
 * @param {*} req 
 * @param {*} res 
 */
exports.getKpiByCreator = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpiByCreator(req.params.member);
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

/**
 * Lấy kpi cá nhân theo id 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Lấy KPI cá nhân theo tháng 
 * @param {*} req 
 * @param {*} res 
 */
exports.getKpiByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKpiByMonth(req.params);
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
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Chỉnh sửa mục tiêu của kpi cá nhân
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Phê duyệt từng mục tiêu của KPI req.params.id  status: req.params.status
 * @param {*} req 
 * @param {*} res 
 */
exports.editStatusTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editStatusTarget(req.params);
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
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskById = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTaskById(req.params);
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
 * Lấy điểm hệ thống
 * @param {} req 
 * @param {*} res 
 */
exports.getSystemPoint = async (req, res) => {
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

/**
 * cập nhật điểm quản lí đánh giá
 * @param {*} req 
 * @param {*} res 
 */
exports.setPointKPI = async (req, res) => {
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

/**
 * cập nhật điểm level
 * @param {*} req 
 * @param {*} res 
 */
exports.setTaskImportanceLevel = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.setTaskImportanceLevel(req.params.id, req.params.kpiType, req.body);
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
