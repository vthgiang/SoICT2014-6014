const overviewService = require('./overview.service');

// Điều phối đến các hàm dịch vụ cơ sở dữ liệu của module quản lý kpi đơn vị
// get all target of unit kpi
exports.get = (req, res) => {
    return overviewService.get(req, res);
};

// Lấy KPI đơn vị hiện tại qua vai trò
exports.getByRole = (req, res) => {
    return overviewService.getByRole(req, res);
}

// Lấy tất cả các mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId = (req, res) => {
    return overviewService.getChildTargetByParentId(req, res);
}

// Khởi tạo KPI đơn vị
exports.create = (req, res) => {
    return overviewService.create(req, res);
}

// Cập nhật dữ liệu mới nhất cho KPI đơn vị
exports.evaluateKPI = (req, res) => {
    return overviewService.evaluateKPI(req, res);
}