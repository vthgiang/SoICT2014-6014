const TaskManagementService = require('./task-management.service');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc
// Lấy tất cả các công việc
exports.get = (req, res) => {
    return TaskManagementService.get(req, res);
}

// Lấy công việc theo id
exports.getById = (req, res) => {
    return TaskManagementService.getById(req, res);
}

// Lấy công việc theo chức danh
exports.getByRole = (req, res) => {
    return TaskManagementService.getByRole(req, res);
}

// Lấy công việc theo vai trò người tạo
exports.getTaskCreatorByUser = (req, res) => {
    return TaskManagementService.getTaskCreatorByUser(req, res);
}

// Lấy công việc theo vai trò người phê duyệt
exports.getTaskAccounatableByUser = (req, res) => {
    return TaskManagementService.getTaskAccounatableByUser(req, res);
}

// Lấy công việc theo vai trò người hỗ trợ
exports.getTaskConsultedByUser = (req, res) => {
    return TaskManagementService.getTaskConsultedByUser(req, res);
}

// Lấy công việc theo vai trò người quan sát
exports.getTaskInformedByUser = (req, res) => {
    return TaskManagementService.getTaskInformedByUser(req, res);
}

// Lấy công việc theo vai trò người thực hiện chính
exports.getTaskResponsibleByUser = (req, res) => {
    return TaskManagementService.getTaskResponsibleByUser(req, res);
}

// Tạo một công việc mới
exports.create = (req, res) => {
    return TaskManagementService.create(req, res);
}

// Xóa một công việc đã thiết lập
exports.delete = (req, res) => {
    return TaskManagementService.delete(req, res);
}