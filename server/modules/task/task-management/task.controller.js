const TaskManagementService = require('./task.service');
const {  LogInfo,  LogError } = require('../../../logs');
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc
/**
 * Lấy tất cả các công việc
 */
exports.getAllTasks = async (req, res) => {
    try {
        var tasks = TaskManagementService.getAllTasks(req, res);
        await LogInfo(req.user.email, ` get all tasks `,req.user.company);
        res.status(200).json({
            success: true, 
            messages: ['get_all_task_success'], 
            content: tasks
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by id `,req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get_all_task_fail'], 
            content: error
        });
    }
}

/**
 *  Lấy công việc theo id
 */
exports.getTask = async (req, res) => {
    try {
        var task = await TaskManagementService.getTask(req.params.id);
        await LogInfo(req.user.email, ` get task by id `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by id `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_id_fail'],
            content: error
        });
    };
};

/**
 * Lấy công việc tạo bởi một người dùng
 */
exports.getAllTasksCreatedByUser = async (req, res) => {
    try {
        var tasks= await TaskManagementService.getTasksCreatedByUser(req.params.id);
        await LogInfo(req.user.email, ` get task by role `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_tasks_by_role_success'],
            content: tasks
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by role  `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_tasks_by_role_fail'],
            content: error
        })
    }

}

/**
 * Lấy công việc theo vai trò người thực hiện chính
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (req, res) => {
    try {
        var task = {
            perPage: req.params.perPage,
            number: req.params.number,
            user: req.params.user,
            organizationalUnit: req.params.unit,
            status: req.params.status,
            priority: req.params.priority,
            special: req.params.special,
            name: req.params.name,
        };
        var responsibleTasks = await TaskManagementService.getPaginatedTasksThatUserHasResponsibleRole(task);
        
        await await LogInfo(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {        
        await await LogError(req.user.email, ` get task responsible by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get_task_of_responsible_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người phê duyệt
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (req, res) => {
    try {
        var accountableTasks = await TaskManagementService.getPaginatedTasksThatUserHasAccountableRole(req.params.perPage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task accountable by user  `,req.user.company)
        // res.status(200).json(accountableTasks);
        res.status(200).json({
            success:true,
            messages: ['get_task_of_accountable_employee_success'],
            content: accountableTasks
        });
    } catch (error) {
        await LogError(req.user.email, ` get task accountable by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get_task_of_accountable_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người hỗ trợ
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (req, res) => {
    try {
        var consultedTasks = await  TaskManagementService.getPaginatedTasksThatUserHasConsultedRole(req.params.perPage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get_task_of_consulted_employee_success'],
            content: consultedTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task consulted by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get_task_of_consulted_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tạo
 */
exports.getPaginatedTasksCreatedByUser = async (req, res) => {
    try {
        var creatorTasks = await  TaskManagementService.getPaginatedTasksCreatedByUser(req.params.perPage,req.params.number,req.params.unit,req.params.status,req.params.user);
        await LogInfo(req.user.email, ` get task creator by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get_task_of_creator_success'],
            content: creatorTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task creator by user `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get_task_of_creator_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người quan sát
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (req, res) => {
    try {
        var informedTasks = await TaskManagementService.getPaginatedTasksThatUserHasInformedRole(req.params.perPage,req.params.number,req.params.unit,req.params.user,req.params.status);
        await LogInfo(req.user.email, ` get task informed by user `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['get_task_of_informed_employee_success'],
            content: informedTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task informed by user  `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['get_task_of_informed_employee_fail'],
            content: error
        })
    }
}

/**
 * Tạo một công việc mới
 */
exports.createTask = async (req, res) => {
    try {
        var task = await TaskManagementService.createTask(req.body); 
        await LogInfo(req.user.email, ` create task `,req.user.company)
        res.status(200).json({
            success:true,
            messages: ['create_task_success'],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` create task  `,req.user.company)
        res.status(400).json({
            success:false,
            messages: ['create_task_fail'],
            content: error
        })
    }
}
/**
 *  Xóa một công việc đã thiết lập
 */
exports.deleteTask = async (req, res) => {
    try {
        TaskManagementService.deleteTask(req.params.id);
        await LogInfo(req.user.email, ` delete task  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_success']
        });
    } catch (error) {
        await LogError(req.user.email, ` delete task `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['delete_fail']
        })
    }
}

/**
 * Chinh sua trang thai cua cong viec
 */
exports.editTaskStatus = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskStatus(req.params.id, req.body.status);
        await LogInfo(req.user.email, ` edit status of task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_status_of_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit status of task `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_status_of_task_fail'],
            content: error
        });
    }
}