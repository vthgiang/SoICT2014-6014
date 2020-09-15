const TaskTemplateService = require('./taskTemplate.service');
const Logger = require(`${SERVER_LOGS_DIR}/_multi-tenant`);

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc

/**
 * Lấy tất cả mẫu công việc
 *  */
exports.getAllTaskTemplates = async (req, res) => {
    if (req.query.roleId) {
        this.getTaskTemplatesOfUserRole(req, res);
    }
    else if (req.query.userId) {
        this.searchTaskTemplates(req, res);
    }
    else {
        try {
            var data = await TaskTemplateService.getAllTaskTemplates(req.portal, req, res);
            res.status(200).json({
                success: true,
                messages: ['get_all_task_templates_success'],
                content: data
            });
        } catch (error) {
            Logger.error(req.user.email, `Get task templates by role ${req.params.id}`, req.portal);
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
        var taskTemplate = await TaskTemplateService.getTaskTemplate(req.portal, req.params.id);
        await Logger.info(req.user.email, `Get task templates ${req.body.name}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_success'],
            content: taskTemplate
        });
    } catch (error) {
        await Logger.error(req.user.email, `Get task templates ${req.body.name}`, req.portal);
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
        var tasks = TaskTemplateService.getTaskTemplatesOfUserRole(req.portal, req.query.roleId);
        Logger.info(req.user.email, `Get task templates by role ${req.query.roleId}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_by_role_success'],
            content: tasks
        });
    } catch (error) {
        Logger.error(req.user.email, `Get task templates by role ${req.query.roleId}`, req.portal);
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
    var arrayUnit = "[]";
    if (req.query.arrayUnit) {
        arrayUnit = req.query.arrayUnit;
    }
    try {
        var pageNumber = Number(req.query.pageNumber);
        var noResultsPerPage = Number(req.query.noResultsPerPage);
        var data = await TaskTemplateService.searchTaskTemplates(req.portal, req.query.userId, pageNumber, noResultsPerPage, arrayUnit, req.query.name);
        Logger.info(req.user.email, `Get task templates by user ${req.query.userId}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_template_by_user_success'],
            content: data
        });
    } catch (error) {
        Logger.error(req.user.email, `Get task templates by user ${req.query.userId}`, req.portal);
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
    try {
        console.log('req.body', req.body);
        var data = await TaskTemplateService.createTaskTemplate(req.portal, req.body);
        await Logger.info(req.user.email, `Create task templates ${req.body.name}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_task_template_success'],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, `Create task templates ${req.body.name}`, req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_task_template_faile'],
            content: error
        });
    }
}

/**
 * Xóa một mẫu công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.deleteTaskTemplate(req.portal, req.params.id);
        await Logger.info(req.user.email, `Delete task templates ${req.params.id}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_template_success'],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, `Delete task templates ${req.params.id}`, req.portal);
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
exports.editTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.editTaskTemplate(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, `Edit task templates ${req.body.name}`, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_template_success'],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, `Edit task templates ${req.body.name}`, req.portal);
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
exports.importTaskTemplate = async (req, res) => {
    try {
        var data = await TaskTemplateService.importTaskTemplate(req.portal, req.body, req.user._id);
        await Logger.info(req.user.email, 'Import task template', req.portal);
        res.status(200).json({
            success: true,
            messages: ["import_task_template_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'Import task template', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_task_template_faile"],
            content: error
        });
    }
}

