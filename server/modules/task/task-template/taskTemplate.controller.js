const TaskTemplateService = require('./taskTemplate.service');
const { LogInfo, LogError } = require('../../../logs');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc
// Lấy tất cả mẫu công việc
exports.getAllTaskTemplates = (req, res) => {
    return TaskTemplateService.getAllTaskTemplates(req, res);
}

// Lấy mẫu công việc theo id
exports.getTaskTemplate = async (req, res) => {
    try {
        var taskTemplate = await TaskTemplateService.getTaskTemplate(req.params.id);
        await LogInfo(req.user.email, `Get task templates ${req.body.name}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_success'],
            content: taskTemplate
        });
    } catch (error) {
        await LogError(req.user.email, `Get task templates ${req.body.name}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_template_faile'],
            content: error
        });
    }
}

// Lấy mẫu công việc mà một UserRole có quyền xem
exports.getTaskTemplatesOfUserRole = (req, res) => {
    try {
        var tasks = TaskTemplateService.getTaskTemplatesOfUserRole(req.params.id);
        LogInfo(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
        res.status(200).json(tasks);
    } catch (error) {
        LogError(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }
}

// Lấy mẫu công việc theo người dùng
exports.searchTaskTemplates = async (req, res) => {
    try {
        var pageNumber = Number(req.body.pageNumber);
        var noResultsPerPage = Number(req.body.noResultsPerPage);
        var data = await TaskTemplateService.searchTaskTemplates(req.body.id, pageNumber, noResultsPerPage, req.body.arrayUnit, req.body.name);
        LogInfo(req.user.email, `Get task templates by user ${req.body.id}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_by_user_success'],
            content: data
        });
    } catch (error) {
        LogError(req.user.email, `Get task templates by user ${req.body.id}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_template_by_user_faile'],
            content: error
        });
    }
}

// Tạo một mẫu công việc
exports.createTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.createTaskTemplate(req.body);
        await LogInfo(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_task_template_sucess'],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['create_task_template_faile'],
            content: error
        });
    }
}

// Xóa một mẫu công việc
exports.deleteTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.deleteTaskTemplate(req.params.id);
        await LogInfo(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(200).json(data);
    } catch (error) {
        await LogError(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(400).json(error);
    }
}

//api sửa 1 mẫu công việc
exports.editTaskTemplate = async(req, res) => {
    try {
        var data = await TaskTemplateService.editTaskTemplate(req.body, req.params.id);
        await LogInfo(req.user.email, `Edit task templates ${req.body.name}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_template_success'],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, `Edit task templates ${req.body.name}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_task_template_faile'],
            content: error
        });
    }
}
 