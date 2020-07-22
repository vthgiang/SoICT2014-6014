const TaskManagementService = require('./task.service');
const NotificationServices = require('../../notification/notification.service');
const { sendEmail } = require('../../../helpers/emailHelper');
const { LogInfo, LogError } = require('../../../logs');
// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý công việc

exports.getTasks = async (req, res) => {
    if (req.query.type === "all") {
        getAllTasks(req, res);
    }

    else if (req.query.type === "responsible") {
        getPaginatedTasksThatUserHasResponsibleRole(req, res);
    }
    else if (req.query.type === "consulted") {
        getPaginatedTasksThatUserHasConsultedRole(req, res);
    }
    else if (req.query.type === "informed") {
        getPaginatedTasksThatUserHasInformedRole(req, res);
    }
    else if (req.query.type === "creator") {
        getPaginatedTasksCreatedByUser(req, res);
    }
    else if (req.query.type === "accountable") {
        getPaginatedTasksThatUserHasAccountableRole(req, res);
    }

    else if (req.query.type === "get_all_task_created_by_user") {
        getAllTasksCreatedByUser(req, res);
    }
}

/**
 * Lấy tất cả các công việc
 */
getAllTasks = async (req, res) => {
    if (req.query.userId !== undefined) {
        getTasksByUser(req, res);
    }
    else {
        try {
            var task = await TaskManagementService.getAllTasks(req, res);
            await LogInfo(req.user.email, ` get all tasks `, req.user.company);
            res.status(200).json({
                success: true,
                messages: ['get_all_task_success'],
                content: task
            });
        } catch (error) {
            await LogError(req.user.email, ` get task by id `, req.user.company);
            res.status(400).json({
                success: false,
                messages: ['get_all_task_fail'],
                content: error
            });
        }
    }
}


exports.getTaskEvaluations = async (req, res) => {
    try {
        let taskEvaluation = await TaskManagementService.getTaskEvaluations(req.body);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_success'],
            content: taskEvaluation,
        });
    } catch (error) {
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
exports.getTaskById = async (req, res) => {
    try {
        var task = await TaskManagementService.getTaskById(req.params.taskId, req.user._id);
        await LogInfo(req.user.email, ` get task by id `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by id `, req.user.company);
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
getAllTasksCreatedByUser = async (req, res) => {
    try {
        var tasks = await TaskManagementService.getTasksCreatedByUser(req.query.userId);
        await LogInfo(req.user.email, ` get task by role `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_tasks_by_role_success'],
            content: tasks
        });
    } catch (error) {
        await LogError(req.user.email, ` get task by role  `, req.user.company)
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
getPaginatedTasksThatUserHasResponsibleRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            startDateAfter: req.query.startDateAfter,
            endDateBefore: req.query.endDateBefore,
        };
        var responsibleTasks = await TaskManagementService.getPaginatedTasksThatUserHasResponsibleRole(task);

        await await LogInfo(req.user.email, ` get task responsible by user `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {
        await await LogError(req.user.email, ` get task responsible by user `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người phê duyệt
 */
getPaginatedTasksThatUserHasAccountableRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };

        var accountableTasks = await TaskManagementService.getPaginatedTasksThatUserHasAccountableRole(task);
        await LogInfo(req.user.email, ` get task accountable by user  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_accountable_employee_success'],
            content: accountableTasks
        });
    } catch (error) {
        await LogError(req.user.email, ` get task accountable by user `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_accountable_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người hỗ trợ
 */
getPaginatedTasksThatUserHasConsultedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };

        var consultedTasks = await TaskManagementService.getPaginatedTasksThatUserHasConsultedRole(task);
        await LogInfo(req.user.email, ` get task consulted by user `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_consulted_employee_success'],
            content: consultedTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task consulted by user `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_consulted_employee_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người tạo
 */
getPaginatedTasksCreatedByUser = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };
        var creatorTasks = await TaskManagementService.getPaginatedTasksCreatedByUser(task);
        await LogInfo(req.user.email, ` get task creator by user `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_creator_success'],
            content: creatorTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task creator by user `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_creator_fail'],
            content: error
        })
    }
}

/**
 * Lấy công việc theo vai trò người quan sát
 */
getPaginatedTasksThatUserHasInformedRole = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };

        var informedTasks = await TaskManagementService.getPaginatedTasksThatUserHasInformedRole(task);
        await LogInfo(req.user.email, ` get task informed by user `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_informed_employee_success'],
            content: informedTasks
        })
    } catch (error) {
        await LogError(req.user.email, ` get task informed by user  `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_informed_employee_fail'],
            content: error
        })
    }
}
/**
 * Lấy công việc theo vai trò người thực hiện chính với điều kiện thời gian
 */
getTasksThatUserHasResponsibleRoleByDate = async (req, res) => {
    try {
        var task = {
            perPage: req.query.perPage,
            number: req.query.number,
            user: req.query.user,
            organizationalUnit: req.query.unit,
            status: req.query.status,
            priority: req.query.priority,
            special: req.query.special,
            name: req.query.name,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };
        var responsibleTasks = await TaskManagementService.getTasksThatUserHasResponsibleRoleByDate(task);

        await await LogInfo(req.user.email, ` get task responsible by user `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_task_of_responsible_employee_success'],
            content: responsibleTasks
        })
    } catch (error) {
        await await LogError(req.user.email, ` get task responsible by user `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_task_of_responsible_employee_fail'],
            content: error
        })
    }
}

/**
 * Tạo một công việc mới
 */
exports.createTask = async (req, res) => {
    try {
        var tasks = await TaskManagementService.createTask(req.body);
        var task = tasks.task;
        var user = tasks.user;
        var email = tasks.email;
        var html = tasks.html;
        var data = { "organizationalUnits": [task.organizationalUnit._id], "title": "Tạo mới công việc", "level": "general", "content": "Bạn được giao nhiệm vụ mới trong công việc", "sender": task.organizationalUnit.name, "users": user };
        NotificationServices.createNotification(task.organizationalUnit.company, data,);
        sendEmail("vnist.qlcv@gmail.com", email, "Tạo mới công việc hành công", '', html);
        await LogInfo(req.user.email, ` create task `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_task_success'],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` create task  `, req.user.company)
        res.status(400).json({
            success: false,
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
        TaskManagementService.deleteTask(req.params.taskId);
        await LogInfo(req.user.email, ` delete task  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_success']
        });
    } catch (error) {
        await LogError(req.user.email, ` delete task `, req.user.company)
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
        var task = await TaskManagementService.editTaskStatus(req.params.taskId, req.body.status);
        await LogInfo(req.user.email, ` edit status of task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_status_of_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit status of task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_status_of_task_fail'],
            content: error
        });
    }
}

/**
 * Chinh sua trang thai luu kho cua cong viec
 */
exports.editArchivedOfTask = async (req, res) => {
    // try {
    var task = await TaskManagementService.editArchivedOfTask(req.params.taskId);
    await LogInfo(req.user.email, ` edit status archived of task  `, req.user.company);
    res.status(200).json({
        success: true,
        messages: ['edit_status_archived_of_task_success'],
        content: task
    })
    // } catch (error) {
    //     await LogError(req.user.email, ` edit status of task `, req.user.company);
    //     res.status(400).json({
    //         success: false,
    //         messages: ['edit_status_archived_of_task_fail'],
    //         content: error
    //     });
    // }
}
/**
 * Lay ra cong viec con
 */
exports.getSubTask = async (req, res) => {
    try {
        var task = await TaskManagementService.getSubTask(req.params.taskId);
        await LogInfo(req.user.email, ` get subtask  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_subtask_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` get subtask `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_subtask_fail'],
            content: error
        })
    }
}

/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByResponsibleEmployees(req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.accountableEmployees };
        NotificationServices.createNotification(tasks.organizationalUnit, data,);
        sendEmail("vnist.qlcv@gmail.com", task.email, "Cập nhật thông tin công việc", '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await LogInfo(req.user.email, ` edit task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * edit task by responsible employee
 */
exports.editTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.editTaskByAccountableEmployees(req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.responsibleEmployees };
        NotificationServices.createNotification(tasks.organizationalUnit, data,);
        sendEmail("vnist.qlcv@gmail.com", task.email, "Cập nhật thông tin công việc", '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await LogInfo(req.user.email, ` edit task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by consulted employee
 */
exports.evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByConsultedEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by responsible employee
 */
exports.evaluateTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByResponsibleEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
/**
 * evaluate task by accountable employee
 */
exports.evaluateTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await TaskManagementService.evaluateTaskByAccountableEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}

//lấy các công việc sắp hết hạn và quá hạn của nhân viên 
getTasksByUser = async (req, res) => {
    try {
        const tasks = await TaskManagementService.getTasksByUser(req.query.userId);

        await LogInfo(req.user.email, 'GET_TASK_BY_USER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_user_success'],
            content: tasks
        });
    }
    catch (error) {
        await LogError(req.user.email, 'GET_TASK_BY_USER', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_user_fail'],
            content: error
        });
    }
}