const KPIMemberService = require('./kpiMember.service');

// Điều phối đến các hàm thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân
// get all target of member kpi
exports.getKPIAllMember = (req, res) => {
    return KPIMemberService.getKPIAllMember(req, res);
};
// get all target of member kpi
exports.getByMember = (req, res) => {
    return KPIMemberService.getByMember(req, res);
};

// get target of personal kpi by id
exports.getById = (req, res) => {
    return KPIMemberService.getById(req, res);
}

// Lấy KPI cá nhân theo tháng
exports.getByMonth = (req, res) => {
    return KPIMemberService.getByMonth(req, res);
};

// Phê duyệt tất cả mục tiêu của KPI
exports.approveAllTarget = (req, res) => {
    return KPIMemberService.approveAllTarget(req, res);
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editTarget = (req, res) => {
    return KPIMemberService.editTarget(req, res);
}

// Phê duyệt từng mục tiêu của KPI
exports.editStatusTarget = (req, res) => {
    return KPIMemberService.editStatusTarget(req, res);
}