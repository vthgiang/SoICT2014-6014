const TaskTemplateService = require('../task-template-management/task-template-management.service');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc
// Lấy tất cả mẫu công việc
exports.get = (req, res) => {
    return TaskTemplateService.get(req, res);
}

// Lấy mẫu công việc theo id
exports.getById = (req, res) => {
    return TaskTemplateService.getById(req, res);
}

// Lấy mẫu công việc theo vai trò
exports.getByRole = (req, res) => {
    return TaskTemplateService.getByRole(req, res);
}

// Lấy mẫu công việc theo người dùng
exports.getByUser = (req, res) => {
    return TaskTemplateService.getByUser(req, res);
}

// Tạo một mẫu công việc
exports.create = (req, res) => {
    return TaskTemplateService.create(req, res);
}

// Xóa một mẫu công việc
exports.delete = (req, res) => {
    return TaskTemplateService.delete(req, res);
}

// api test dữ liệu
exports.test = (req, res) => {
    return TaskTemplateService.test(req, res);
}