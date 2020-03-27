const TaskTemplateService = require('../task-template-management/task-template-management.service');
const { LogInfo, LogError } = require('../../logs');

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
    try {
        var tasks = TaskTemplateService.getByRole(req.params.id);
        LogInfo(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
        res.status(200).json(tasks);
    } catch (error) {
        LogError(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }
}

// Lấy mẫu công việc theo người dùng
exports.getByUser = async (req, res) => {
    try {
        var data = await TaskTemplateService.getByUser(req.params.id, req.params.number, req.params.unit);
        LogInfo(req.user.email, `Get task templates by user ${req.params.id}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        LogError(req.user.email, `Get task templates by user ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }

}

// Tạo một mẫu công việc
exports.create = async (req, res) => {
    try {
        var data = await TaskTemplateService.create(req.body);
        await LogInfo(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
        res.status(400).json(error);
    }
}

// Xóa một mẫu công việc
exports.delete = async (req, res) => {
    try {
        var data = await TaskTemplateService.delete(req.params.id);
        await LogInfo(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }
}

// api test dữ liệu
exports.test = (req, res) => {
    return TaskTemplateService.test(req, res);
}