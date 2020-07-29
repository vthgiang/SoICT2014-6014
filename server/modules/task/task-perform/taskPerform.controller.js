const PerformTaskService = require('./taskPerform.service');
const { LogInfo, LogError } = require('../../../logs');
const NotificationServices = require('../../notification/notification.service');
const { sendEmail } = require('../../../helpers/emailHelper');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc


/**
 * Lấy lịch sử bấm giờ 
 */
exports.getTaskTimesheetLogs = async (req, res) => {
    try {
        var logTimer = await PerformTaskService.getTaskTimesheetLogs(req.params);
        await LogInfo(req.user.email, ` get log timer  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_log_timer_success'],
            content: logTimer
        })
    } catch (error) {
        await LogError(req.user.email, ` get log timer  `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_log_timer_fail'],
            content: error
        })
    }
}
/**
 * Lấy trạng thái bấm giờ hiện tại
 */
exports.getActiveTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.getActiveTimesheetLog(req.query);
        await LogInfo(req.user.email, `get timer status`, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_timer_status_success'],
            content: timerStatus
        })
    } catch (error) {
        await LogError(req.user.email, `get timer status`, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_timer_status_fail'],
            content: error
        })
    }
}
/**
 * Bắt đầu bấm giờ
 */
exports.startTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.startTimesheetLog(req.params, req.body);
        //await LogInfo(req.user.email, ` start timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['start_timer_success'],
            content: timerStatus
        })
    } catch (error) {
        //await LogError(req.user.email, ` start timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['start_timer_fail'],
            content: error
        })
    }
}

/**
 * Kết thúc bấm giờ
 */
exports.stopTimesheetLog = async (req, res) => {
    try {
        var timer = await PerformTaskService.stopTimesheetLog(req.params, req.body);
        await LogInfo(req.user.email, ` stop timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['stop_timer_success'],
            content: timer
        })
    } catch (error) {
        await LogError(req.user.email, ` stop timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['stop_timer_fail'],
            content: error
        })
    }


}
/**
 *  Tạo hoạt động
 */
exports.createTaskAction = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }

        var task = await PerformTaskService.createTaskAction(req.params, req.body, files);
        var taskAction = task.taskActions;
        var tasks = task.tasks;
        var user = task.user;
        var data = { "organizationalUnits": tasks.organizationalUnit, "title": "Phê duyệt hoạt động", "level": "general", "content": `${user.name} đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này `, "sender": tasks.name, "users": tasks.accountableEmployees };
        NotificationServices.createNotification(tasks.organizationalUnit, data,);
        sendEmail("vnist.qlcv@gmail.com", task.email, "Phê duyệt hoạt động", '', `<p>${user.name} đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`);
        await LogInfo(req.user.email, ` create task action  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` create task action  `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['create_task_action_fail'],
            content: error
        })
    }
}
/**
 * Sửa hoạt động
 */
exports.editTaskAction = async (req, res) => {

    if (req.body.type === "evaluation") {

        evaluationAction(req, res);

    } else
        try {
            var files = [];
            if (req.files !== undefined) {
                req.files.forEach((elem, index) => {
                    var path = elem.destination + '/' + elem.filename;
                    files.push({ name: elem.originalname, url: path })

                })
            }
            var taskAction = await PerformTaskService.editTaskAction(req.params, req.body, files);
            await LogInfo(req.user.email, ` edit task action  `, req.user.company)
            res.status(200).json({
                success: true,
                messages: ['edit_task_action_success'],
                content: taskAction
            })
        } catch (error) {
            await LogError(req.user.email, ` edit task action  `, req.user.company)
            res.status(400).json({
                success: false,
                messages: ['edit_task_action_fail'],
                content: error
            })
        }
}
/**
 *  Xóa hoạt động
 */
exports.deleteTaskAction = async (req, res) => {
    try {
        var taskAction = await PerformTaskService.deleteTaskAction(req.params);
        await LogInfo(req.user.email, ` delete task action  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` delete task action  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_task_action_fail'],
            content: error
        })
    }
}
/**
 *  Tạo bình luận cho hoạt động
 */
exports.createCommentOfTaskAction = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var actionComment = await PerformTaskService.createCommentOfTaskAction(req.params, req.body, files);
        await LogInfo(req.user.email, ` create  action comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await LogError(req.user.email, ` create  action comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['create_action_comment_fail'],
            content: error
        })
    }
}
/**
 *  Sửa bình luận cho hoạt động
 */
exports.editCommentOfTaskAction = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var actionComment = await PerformTaskService.editCommentOfTaskAction(req.params, req.body, files);
        await LogInfo(req.user.email, ` edit action comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit action comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_action_comment_fail'],
            content: error
        })
    }
}

/**
 *  Xóa bình luận cho hoạt động
 */
exports.deleteCommentOfTaskAction = async (req, res) => {
    try {
        var task = await PerformTaskService.deleteCommentOfTaskAction(req.params);
        await LogInfo(req.user.email, ` delete action comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` delete action comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_action_comment_fail'],
            content: error
        })
    }


}
/**
 * Tạo bình luận của công việc
 */
exports.createTaskComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var taskComment = await PerformTaskService.createTaskComment(req.params, req.body, files);
        await LogInfo(req.user.email, ` create task comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` create task comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ["create_task_comment_fail"],
            content: error
        })
    }
}
/**
 * Sửa bình luận của hoạt động
 */
exports.editTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let taskComment = await PerformTaskService.editTaskComment(req.params, req.body, files);
        await LogInfo(req.user.email, ` edit task comments  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task comments  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (req, res) => {
    try {
        let taskComment = await PerformTaskService.deleteTaskComment(req.params);
        await LogInfo(req.user.email, ` delete task comments  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` delete task comments  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa bình luận của bình luận
 */
exports.deleteFileChildTaskComment = async (req, res) => {
    try {
        let taskComment = await PerformTaskService.deleteFileChildTaskComment(req.params);
        await LogInfo(req.user.email, ` delete task comments  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_file_child_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` delete task comments  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_file_child_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Tạo bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comment = await PerformTaskService.createCommentOfTaskComment(req.params, req.body, files);
        await LogInfo(req.user.email, ` create comment of task comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` create comment of task comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['create_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Suửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comment = await PerformTaskService.editCommentOfTaskComment(req.params, req.body, files);
        await LogInfo(req.user.email, ` edit comment of task comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit comment of task comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Xoa binh luan cua binh luan cong viec
 */
exports.deleteCommentOfTaskComment = async (req, res) => {
    try {
        var comment = await PerformTaskService.deleteCommentOfTaskComment(req.params);
        await LogInfo(req.user.email, ` delete comment of task comment  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` delete comment of task comment  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_comment_of_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Đánh giá hoạt động
 */
evaluationAction = async (req, res) => {
    // try {
        var taskAction = await PerformTaskService.evaluationAction(req.params, req.body);
        await LogInfo(req.user.email, ` evaluation action  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['evaluation_action_success'],
            content: taskAction
        })
    // } catch (error) {
    //     await LogError(req.user.email, ` evaluation action  `, req.user.company)
    //     res.status(400).json({
    //         success: false,
    //         messages: ['evaluation_action_fail'],
    //         content: error
    //     })
    // }
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (req, res) => {
    try {
        var abc = await PerformTaskService.confirmAction(req.params,req.body);
        await LogInfo(req.user.email, ` confirm action  `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['confirm_action_success'],
            content: abc
        })
    } catch (error) {
        await LogError(req.user.email, ` confirm action  `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['confirm_action_fail'],
            content: error
        })
    }
}
/**
 * Upload tài liệu công việc
 */
exports.uploadFile = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path, description: req.body.description, creator: req.body.creator })

            })
        }
        var comment = await PerformTaskService.uploadFile(req.params, req.body, files);
        await LogInfo(req.user.email, ` upload file of task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['upload_file_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, `upload file of task  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['upload_file_fail'],
            content: error
        })
    }
}

/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (req, res) => {
    try {
    let comment = await PerformTaskService.deleteFileOfAction(req.params);
                                                                                                                                                                                                                                                                                                         await LogInfo(req.user.email, ` delete file of task  `, req.user.company);
    res.status(200).json({
        success: true,
        messages: ['delete_file_success'],
        content: comment
    })
    } catch (error) {
    await LogError(req.user.email, `delete file of task  `, req.user.company);
    res.status(400).json({
        success: false,
        messages: ['delete_file_fail'],
        content: error
    })
    }
}
/**
 * Xóa file của bình luận hoạt động
 */
exports.deleteFileCommentOfAction = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteFileCommentOfAction(req.params);
        await LogInfo(req.user.email, ` delete file of task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_of_action_success'],
            content: file
        })
    } catch (error) {
        await LogError(req.user.email, `delete file of task  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_file_comment_of_action_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của trao đổi
 */
exports.deleteFileTaskComment = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteFileTaskComment(req.params);
        await LogInfo(req.user.email, ` delete file of task  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_file_task_comment_success'],
            content: file
        })
    } catch (error) {
        await LogError(req.user.email, `delete file of task  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_file_task_comment_fail'],
            content: error
        })
    }
}
/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (req, res) => {
    try {
        var task = await PerformTaskService.addTaskLog(req.params,req.body);
        await LogInfo(req.user.email, ` CREATE_TASK_LOG  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ["create_task_log_success"],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` CREATE_TASK_LOG  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['create_task_log_fail'],
            content: error
        });
    }
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (req, res) => {
    try {
        var taskLog = await PerformTaskService.getTaskLog(req.params);
        await LogInfo(req.user.email, ` GET_TASK_LOG  `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_task_log_success"],
            content: taskLog
        });
    } catch (error) {
        await LogError(req.user.email, ` GET_TASK_LOG  `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_log_fail'],
            content: error
        });
    }
}

/**
 * chỉnh sửa công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.editTask = async (req, res) => {
    if(req.query.type === 'all') {
        if(req.query.role === 'responsible') {
            editTaskByResponsibleEmployees(req, res);
        }
        else if(req.query.role === 'accountable'){
            editTaskByAccountableEmployees(req, res);
        }
    }
    else if(req.query.type === 'edit_archived') {
        editArchivedOfTask(req, res);
    }
    else if(req.query.type === 'edit_status') {
        editTaskStatus(req, res);
    }
}

/**
 * đánh giá công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.evaluateTask = async (req, res) => {
    if(req.query.role === 'responsible'){
        evaluateTaskByResponsibleEmployees(req, res);
    }
    else if(req.query.role === 'consulted') {
        evaluateTaskByConsultedEmployees(req, res);
    }
    else if(req.query.role === 'accountable') {
        evaluateTaskByAccountableEmployees(req, res);
    }
}
/**
 * edit task by responsible employee
 */
editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskByResponsibleEmployees(req.body, req.params.taskId);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": [tasks.organizationalUnit], "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.accountableEmployees };
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
editTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskByAccountableEmployees(req.body, req.params.taskId);
        var user = task.user;
        var tasks = task.tasks;
        var data = { "organizationalUnits": [tasks.organizationalUnit], "title": "Cập nhật thông tin công việc", "level": "general", "content": `${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`, "sender": tasks.name, "users": tasks.responsibleEmployees };
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
evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.evaluateTaskByConsultedEmployees(req.body, req.params.taskId);
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
evaluateTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.evaluateTaskByResponsibleEmployees(req.body, req.params.taskId);
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
evaluateTaskByAccountableEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.evaluateTaskByAccountableEmployees(req.body, req.params.taskId);
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
 * Chinh sua trang thai luu kho cua cong viec
 */
editArchivedOfTask = async (req, res) => {
    try {
    var task = await PerformTaskService.editArchivedOfTask(req.params.taskId);
    await LogInfo(req.user.email, ` edit status archived of task  `, req.user.company);
    res.status(200).json({
        success: true,
        messages: ['edit_status_archived_of_task_success'],
        content: task
    })
    } catch (error) {
        await LogError(req.user.email, ` edit status of task `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_status_archived_of_task_fail'],
            content: error
        });
    }
}

/**
 * Chinh sua trang thai cua cong viec
 */
editTaskStatus = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskStatus(req.params.taskId, req.body.status);
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