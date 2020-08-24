const TaskTemplateService = require('./taskTemplate.service');
const { LogInfo, LogError } = require('../../../logs');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc

/**
 * Lấy tất cả mẫu công việc
 *  */ 
exports.getAllTaskTemplates = async (req, res) => {
    if(req.query.roleId){
        this.getTaskTemplatesOfUserRole(req,res);
    }
    else if(req.query.userId){
        this.searchTaskTemplates(req,res);
    }
    else{
        try {
            var data = await TaskTemplateService.getAllTaskTemplates(req, res);
            res.status(200).json({
                success: true,
                messages: ['get_all_task_templates_success'],
                content: data
            });
        } catch (error) {
            LogError(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
            res.status(400).json({
                success: false,
                messages: ['get_all_task_templates_faile'],
                content: error
            });
        }
    }
}

/**
 * Lấy mẫu công việc theo id
 * @param {*} req 
 * @param {*} res 
 */
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
        res.status(200).json({
            success: false,
            messages: ['get_task_template_faile'],
            content: error
        });
    }
}

/**
 * Lấy mẫu công việc mà một UserRole có quyền xem (service tam thoi khong dung)
 * @param {*} req 
 * @param {*} res 
 */
exports.getTaskTemplatesOfUserRole = (req, res) => {
    try {
        var tasks = TaskTemplateService.getTaskTemplatesOfUserRole(req.query.roleId);
        LogInfo(req.user.email, `Get task templates by role ${req.query.roleId}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_by_role_success'],
            content: tasks
        });
    } catch (error) {
        LogError(req.user.email, `Get task templates by role ${req.query.roleId}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_template_by_role_faile'],
            content: error
        });
    }
}

/**
 * Lấy mẫu công việc theo thông tin tìm kiếm
 * @param {*} req 
 * @param {*} res 
 */
exports.searchTaskTemplates = async (req, res) => {
    var arrayUnit="[]";
    if(req.query.arrayUnit){
        arrayUnit = req.query.arrayUnit;
    }
    try {
        var pageNumber = Number(req.query.pageNumber);
        var noResultsPerPage = Number(req.query.noResultsPerPage);
        var data = await TaskTemplateService.searchTaskTemplates(req.query.userId, pageNumber, noResultsPerPage, arrayUnit, req.query.name);
        LogInfo(req.user.email, `Get task templates by user ${req.query.userId}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_by_user_success'],
            content: data
        });
    } catch (error) {
        LogError(req.user.email, `Get task templates by user ${req.query.userId}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_template_by_user_faile'],
            content: error
        });
    }
}

/**
 * Tạo một mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.createTaskTemplate = async (req, res) => {
    // try {
        console.log('req.body', req.body);
        var data = await TaskTemplateService.createTaskTemplate(req.body);
        await LogInfo(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_task_template_success'],
            content: data
        });
    // } catch (error) {
    //     await LogError(req.user.email, `Create task templates ${req.body.name}`, req.user.company);
    //     res.status(400).json({
    //         success: false,
    //         messages: ['create_task_template_faile'],
    //         content: error
    //     });
    // }
}

/**
 * Xóa một mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.deleteTaskTemplate(req.params.id);
        await LogInfo(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_template_success'],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, `Delete task templates ${req.params.id}`, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_task_template_faile'],
            content: error
        });
    }
}

/**
 * Sửa 1 mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
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
/**
 * Import file Exel
 * @param {*} req 
 * @param {*} res 
 */
exports.importTaskTemplate = async(req, res)=>{
    try {
        var data = await TaskTemplateService.importTaskTemplate(req.body, req.user._id);
        await LogInfo(req.user.email, 'Import task template', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["import_task_template_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'Import task template', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["import_task_template_faile"],
            content: {
                error: error
            }
        });
    }
}

