const KPIMemberService = require('./employeeEvaluation.service');
const { LogInfo, LogError } = require('../../../../logs');
// get all target of member kpi
exports.getKPIAllMember = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKPIAllMember(req.params);
        await LogInfo(req.user.emai, `Get kpi all member`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy tất cả KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.emai, `Get kpi all  member`, req.user.company);
        res.status(400).json({
            messages: ['Lấy tất cả KPI nhân viên lỗi'],
            message: error
        });
    }
};
// get all target of member kpi
exports.getByMember = async (req, res) => {
    try {
        console.log("id member", req.params.member)
        const kpimembers = await KPIMemberService.getByMember(req.params.member);
        LogInfo(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy mục tiêu KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(400).json({
            messages: ['Lấy mục tiêu KPI nhân viên lỗi'],
            message: error
        });
    }
};

// get target of personal kpi by id req.params.id
exports.getById = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getById(req.params.id);
        LogInfo(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy tất cả KPI nhân viên theo Id thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(400).json({
            messages: ['Lấy tất cả KPI nhân viên theo Id lỗi'],
            message: error
        });
    }
}

// Lấy KPI cá nhân theo tháng  creater: req.params.id, time: month
exports.getByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getByMonth(req.params);
        LogInfo(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy tất cả KPI nhân viên theo tháng thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(400).json({
            messages: ['Lấy tất cả KPI nhân viên theo tháng lỗi'],
            message: error
        });
    }
};

// Phê duyệt tất cả mục tiêu của KPI req.params.id
exports.approveAllTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.approveAllTarget(req.params.id);
        LogInfo(req.user.email, `Approve all target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Phê duyệt KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Approve all target`, req.user.company);
        res.status(400).json({
            messages: ['Phê duyệt KPI nhân viên lỗi'],
            message: error
        });
    }
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editTarget(req.params.id, req.body);
        LogInfo(req.user.email, `Edit target member`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Chỉnh sửa KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Edit target member`, req.user.company);
        res.status(400).json({
            messages: ['Chỉnh sửa KPI nhân viên lỗi'],
            message: error
        });
    }
}

// Phê duyệt từng mục tiêu của KPI req.params.id  status: req.params.status
exports.editStatusTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editStatusTarget(req.params.id);
        LogInfo(req.user.email, `Edit status target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Phê duyệt KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
        LogError(req.user.email, `Edit status target`, req.user.company);
        res.status(400).json({
            messages: ['Phê duyệt KPI nhân viên lỗi'],
            message: error
        });
    }
}

exports.getTaskById= async(req, res) => {
    try {
        const kpimembers = await KPIMemberService.getTaskById(req.params.id);
       LogInfo(req.user.email, `Edit status target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy danh sách công việc theo từng KPI thành công'],
            content: kpimembers
        });
    } catch (error) {
       LogError(req.user.email, `Edit status target`, req.user.company);
        res.status(400).json({
            messages: ['Lấy danh sách công việc theo từng KPI lỗi'],
            message: error
        });
    } 
}
exports.getSystemPoint= async(req, res) => {
    try {
        const kpimembers = await KPIMemberService.getSystemPoint(req.params.id);
       LogInfo(req.user.email, `Edit status target`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy điểm hệ thống cho KPI thành công'],
            content: kpimembers
        });
    } catch (error) {
       LogError(req.user.email, `Edit status target`, req.user.company);
        res.status(400).json({
            messages: ['Lấy điểm hệ thống cho KPI lỗi'],
            message: error
        });
    }
}

// cập nhật điểm quản lí đánh giá
exports.setPointKPI = async (req, res) =>{
    try {
        const kpimembers = await KPIMemberService.setPointKPI(req.params.id_kpi, req.params.id_target, req.body);
      LogInfo(req.user.email, `Set point for kpi`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Chấm điểm KPI nhân viên thành công'],
            content: kpimembers
        });
    } catch (error) {
       LogInfo(req.user.email, `Set point for kpi`, req.user.company);
        res.status(400).json({
            messages: ['Chấm điểm KPI nhân viên lỗi'],
            message: error
        });
    }
}