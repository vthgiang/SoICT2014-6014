const KPIMemberService = require('./kpiMember.service');
const { LogInfo, LogError } = require('../../logs');
// get all target of member kpi
exports.getKPIAllMember = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getKPIAllMember(req.params);
        LogInfo(req.user.emai, `Get kpi all member`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.emai, `Get kpi all  member`, req.user.company);
        res.status(400).json(error);
    }
};
// get all target of member kpi
exports.getByMember = async (req, res) => {
    try {
        console.log("id member", req.params.member)
        const kpimembers = await KPIMemberService.getByMember(req.params.member);
        LogInfo(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.email, `Get kpi member by creater`, req.user.company);
        res.status(400).json(error);
    }
};

// get target of personal kpi by id req.params.id
exports.getById = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getById(req.params.id);
        LogInfo(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.email, `Get kpi member by id`, req.user.company);
        res.status(400).json(error);
    }
}

// Lấy KPI cá nhân theo tháng  creater: req.params.id, time: month
exports.getByMonth = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.getByMonth(req.params);
        LogInfo(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.email, `Get kpi member by month`, req.user.company);
        res.status(400).json(error);
    }
};

// Phê duyệt tất cả mục tiêu của KPI req.params.id
exports.approveAllTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.approveAllTarget(req.params.id);
        LogInfo(req.user.email, `Approve all target`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.emai, `Approve all target`, req.user.company);
        res.status(400).json(error);
    }
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editTarget(req.params.id, req.body);
        LogInfo(req.user.emai, `Edit target member`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.emai, `Edit target member`, req.user.company);
        res.status(400).json(error);
    }
}

// Phê duyệt từng mục tiêu của KPI req.params.id  status: req.params.status
exports.editStatusTarget = async (req, res) => {
    try {
        const kpimembers = await KPIMemberService.editStatusTarget(req.params);
        LogInfo(req.user.emai, `Edit status target`, req.user.company);
        res.status(200).json(kpimembers);
    } catch (error) {
        LogError(req.user.emai, `Edit status target`, req.user.company);
        res.status(400).json(error);
    }
}