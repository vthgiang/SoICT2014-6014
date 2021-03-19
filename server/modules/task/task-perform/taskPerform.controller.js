const PerformTaskService = require('./taskPerform.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);
const NewsFeed = require('../../newsFeed/newsFeed.service');
const { sendEmail } = require(`../../../helpers/emailHelper`);
const { difference } = require('lodash');
const moment = require('moment');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc

/**
 *  Lấy công việc theo id
 */
exports.getTaskById = async (req, res) => {
    try {
        var task = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        await Logger.info(req.user.email, ` get task by id `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_task_by_id_success'],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, ` get task by id `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_task_by_id_fail'],
            content: error
        });
    };
};

/**
 * Lấy lịch sử bấm giờ 
 */
exports.getTaskTimesheetLogs = async (req, res) => {
    try {
        let logTimer = await PerformTaskService.getTaskTimesheetLogs(req.portal, req.params);
        await Logger.info(req.user.email, ` get log timer  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_log_timer_success'],
            content: logTimer
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get log timer  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_log_timer_fail'],
            content: error
        })
    }
}

exports.getTaskTimesheetLog = async (req, res) => {
    if (req.query.currentTimesheetLog) {
        getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit(req, res);
    } else {
        getActiveTimesheetLog(req, res);
    }
}

/**
 * Lấy trạng thái bấm giờ hiện tại
 */
getActiveTimesheetLog = async (req, res) => {
    try {
        let timerStatus = await PerformTaskService.getActiveTimesheetLog(req.portal, req.query);
        await Logger.info(req.user.email, `get timer status`, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_timer_status_success'],
            content: timerStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, `get timer status`, req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_timer_status_fail'],
            content: error
        })
    }
}

/** Lấy các nhân viên đang bấm giờ trong 1 đơn vị */
getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit = async (req, res) => {
    try {
        let timesheetLog = await PerformTaskService.getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit(req.portal, req.query);
        
        await Logger.info(req.user.email, ` get current timesheet log `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_current_timesheet_log_success'],
            content: timesheetLog
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get current timesheet log `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_current_timesheet_log_failure'],
            content: error
        })
    }
}

/**
 * Bắt đầu bấm giờ
 */
exports.startTimesheetLog = async (req, res) => {
    try {
        let timerStatus = await PerformTaskService.startTimesheetLog(req.portal, req.params, req.body);
        await Logger.info(req.user.email, 'start_timer_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['start_timer_success'],
            content: timerStatus
        })
    } catch (error) {
        await Logger.error(req.user.email, 'start_timer_faile', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['start_timer_fail'],
            content: error
        })
    }
}

/**
 * Kết thúc bấm giờ
 */
exports.stopTimesheetLog = async (req, res) => {
    try {
        let timer = await PerformTaskService.stopTimesheetLog(req.portal, req.params, req.body, req.user);
        await Logger.info(req.user.email, 'stop_timer_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['stop_timer_success'],
            content: timer
        })
    } catch (error) {
        await Logger.error(req.user.email, 'stop_timer_faile', req.portal)
        res.status(400).json({
            success: false,
            messages: ['stop_timer_fail'],
            content: error
        })
    }
}

/**
 * 
 * Sửa lịch sửa bấm giờ
 */
exports.editTimeSheetLog = async (req, res) => {
    try {
        let {taskId, timesheetlogId} = req.params;
        let timer = await PerformTaskService.editTimeSheetLog(req.portal, taskId, timesheetlogId, req.body);
        await Logger.info(req.user.email, 'edit_time_sheet_log_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_time_sheet_log_success'],
            content: timer
        })
    } catch (error) {
        await Logger.error(req.user.email, 'edit_time_sheet_log_faile', req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_time_sheet_log_fail'],
            content: error
        })
    }
}

/**
 *  Tạo hoạt động
 */
exports.createTaskAction = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }

        let task = await PerformTaskService.createTaskAction(req.portal, req.params, req.body, files);
        let taskAction = task.taskActions;
        let tasks = task.tasks;
        let userCreator = task.userCreator;
        // message gửi cho người phê duyệt

        const associatedData = {
            dataType: "realtime_tasks",
            value: task.tasks
        }
        let accountableFilter = tasks.accountableEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
        accountableFilter = accountableFilter.map(o => o._id);
        
        const associatedDataforAccountable = {
            "organizationalUnits": tasks.organizationalUnit && tasks.organizationalUnit._id,
            "title": "Phê duyệt hoạt động",
            "level": "general",
            "content": `<p><strong>${userCreator.name}</strong> đã thêm mới hoạt động cho công việc <strong>${tasks.name}</strong>, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`,
            "sender": userCreator.name,
            "users": accountableFilter,
            "associatedData": associatedData,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${userCreator.name} đã thêm mới hoạt động, phê duyệt ngay! </p>`
            }
        };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, associatedDataforAccountable);
       
        // message gửi cho người thực hiện
        // Loại người tạo hoặt động khỏi danh sách người nhận thông báo
        let userReceive = tasks.responsibleEmployees.filter(obj => obj._id.toString() !== req.user._id.toString());
        userReceive = userReceive.map(user => user._id.toString());
        let accountable = tasks.accountableEmployees.map(acc => acc._id.toString());

        // Lọc trong danh sách userReceive có chứa người phê duyệt hay ko.. 1 người có thể có nhiều vai trò(mục đích gửi 1 lần thông báo tới ngươi phê duyệt)
        userReceive = difference(userReceive, accountable)

        const associatedDataforResponsible = {
            "organizationalUnits": tasks.organizationalUnit && tasks.organizationalUnit._id,
            "title": "Thêm mới hoạt động",
            "level": "general",
            "content": `<p><strong>${userCreator.name}</strong> đã thêm mới hoạt động cho công việc <strong>${tasks.name}</strong>, chi tiết công việc: <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`,
            "sender": userCreator.name,
            "users": userReceive,
            "associatedData": associatedData,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${userCreator.name} đã thêm mới một hoạt động.</p>`
            }
        };

        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, associatedDataforResponsible);
        sendEmail(task.email, "Phê duyệt hoạt động", '', `<p><strong>${userCreator.name}</strong> đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`);
        
        await Logger.info(req.user.email, ` create task action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create task action  `, req.portal)
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
            let files = [];
            if (req.files !== undefined) {
                req.files.forEach((elem, index) => {
                    let path = elem.destination + '/' + elem.filename;
                    files.push({ name: elem.originalname, url: path })

                })
            }
            let taskAction = await PerformTaskService.editTaskAction(req.portal, req.params, req.body, files);
            await Logger.info(req.user.email, ` edit task action  `, req.portal)
            res.status(200).json({
                success: true,
                messages: ['edit_task_action_success'],
                content: taskAction
            })
        } catch (error) {
            await Logger.error(req.user.email, ` edit task action  `, req.portal)
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
        let taskAction = await PerformTaskService.deleteTaskAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task action  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task action  `, req.portal);
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
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let actionComment = await PerformTaskService.createCommentOfTaskAction(req.portal, req.params, req.body, files, req.user);
        await Logger.info(req.user.email, ` create  action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create  action comment  `, req.portal);
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
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let actionComment = await PerformTaskService.editCommentOfTaskAction(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_action_comment_success'],
            content: actionComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit action comment  `, req.portal);
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
        let task = await PerformTaskService.deleteCommentOfTaskAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete action comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete action comment  `, req.portal);
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
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let taskComment = await PerformTaskService.createTaskComment(req.portal, req.params, req.body, files, req.user);
        await Logger.info(req.user.email, ` create task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create task comment  `, req.portal);
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
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let taskComment = await PerformTaskService.editTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task comments  `, req.portal);
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
        let taskComment = await PerformTaskService.deleteTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task comments  `, req.portal);
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
        let taskComment = await PerformTaskService.deleteFileChildTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete task comments  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_child_task_comment_success'],
            content: taskComment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete task comments  `, req.portal);
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
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comment = await PerformTaskService.createCommentOfTaskComment(req.portal, req.params, req.body, files, req.user);
        await Logger.info(req.user.email, ` create comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment of task comment  `, req.portal);
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
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comment = await PerformTaskService.editCommentOfTaskComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment of task comment  `, req.portal);
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
        let comment = await PerformTaskService.deleteCommentOfTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment of task comment  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment of task comment  `, req.portal);
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
    try {
        let taskAction = await PerformTaskService.evaluationAction(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` evaluation action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['evaluation_action_success'],
            content: taskAction
        })
    } catch (error) {
        await Logger.error(req.user.email, ` evaluation action  `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['evaluation_action_fail'],
            content: error
        })
    }
}

exports.evaluationAllAction = async (req, res) => {
    try {
        let action = await PerformTaskService.evaluationAllAction(req.portal, req.params, req.body, req.user._id);
        await Logger.info(req.user.email, ` evaluation all action success  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['evaluation_all_action_success'],
            content: action
        })
    } catch (error) {
        await Logger.error(req.user.email, ` evaluation all action fail `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['evaluation_all_action_fail'],
            content: error
        })
    }
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (req, res) => {
    try {
        let abc = await PerformTaskService.confirmAction(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` confirm action  `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['confirm_action_success'],
            content: abc
        })
    } catch (error) {
        await Logger.error(req.user.email, ` confirm action  `, req.portal)
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
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path, description: req.body.description, creator: req.body.creator })

            })
        }
        let comment = await PerformTaskService.uploadFile(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` upload file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['upload_file_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, `upload file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['upload_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của task
 */
exports.deleteFileTask = async (req, res) => {
    try {
        let task = await PerformTaskService.deleteFileTask(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (req, res) => {
    try {
        let comment = await PerformTaskService.deleteFileOfAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task action  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_success'],
            content: comment
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task action  `, req.portal);
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
        let file = await PerformTaskService.deleteFileCommentOfAction(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_of_action_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
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
        let file = await PerformTaskService.deleteFileTaskComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_file_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete file of task  `, req.portal);
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
        let task = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, req.body);

        await Logger.info(req.user.email, ` CREATE_TASK_LOG  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_task_log_success"],
            content: task
        });
    } catch (error) {
        await Logger.error(req.user.email, ` CREATE_TASK_LOG  `, req.portal);
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
        let taskLog = await PerformTaskService.getTaskLog(req.portal, req.params.taskId);
        await Logger.info(req.user.email, ` GET_TASK_LOG  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_task_log_success"],
            content: taskLog
        });
    } catch (error) {
        await Logger.error(req.user.email, ` GET_TASK_LOG  `, req.portal);
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
    if (req.body.type === 'all') {
        if (req.body.role === 'responsible') {
            editTaskByResponsibleEmployees(req, res);
        }
        else if (req.body.role === 'accountable') {
            editTaskByAccountableEmployees(req, res);
        }
    }
    else if (req.body.type === 'edit_archived') {
        editArchivedOfTask(req, res);
    }
    else if (req.body.type === 'edit_activate') {
        editActivateOfTask(req, res);
    }
    else if (req.query.type === 'confirm_task') {
        confirmTask(req, res);
    }
    else if (req.body.requestAndApprovalCloseTask) {
        requestAndApprovalCloseTask(req, res);
    }
    else if (req.body.type === 'open_task_again') {
        openTaskAgain(req, res);
    }
    else if (req.query.type === 'edit_employee_collaborated_with_unit') {
        editEmployeeCollaboratedWithOrganizationalUnits(req, res);
    }
}

/**
 * đánh giá công việc
 * @param {*} req 
 * @param {*} res 
 */
exports.evaluateTask = async (req, res) => {
    if (req.body.role === 'responsible') {
        evaluateTaskByResponsibleEmployees(req, res);
    }
    else if (req.body.role === 'consulted') {
        evaluateTaskByConsultedEmployees(req, res);
    }
    else if (req.body.role === 'accountable') {
        evaluateTaskByAccountableEmployees(req, res);
    }
    else if (req.body.type === 'hoursSpent') {
        editHoursSpentInEvaluate(req, res);
    }
}
/**
 * edit task by responsible employee
 */
editTaskByResponsibleEmployees = async (req, res) => {
    try {
        let oldTask = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        let task = await PerformTaskService.editTaskByResponsibleEmployees(req.portal, req.body.data, req.params.taskId);
        let user = task.user;
        let tasks = task.tasks;
        let data = {
            "organizationalUnits": tasks.organizationalUnit,
            "title": "Cập nhật thông tin công việc",
            "level": "general",
            "content": `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}" target="_blank">${tasks?.name}</a> với vai trò người thực hiện</p>`,
            "sender": user.name,
            "users": tasks.accountableEmployees,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${user.name} đã cập nhật thông tin công việc với vai trò người thực hiện</p>`
            }
        };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data);

        let title = "Cập nhật thông tin công việc: " + task.tasks.name;
        sendEmail(task.email, title, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${tasks?.name}</a> với vai trò người thực hiện</p>`);

        // Thêm nhật ký hoạt động
        let description = await PerformTaskService.createDescriptionEditTaskLogs(req.portal, req.user._id, task.newTask, oldTask);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin công việc theo vai trò người thực hiện",
            description: description
        }
        let taskLog = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);
        
        // Tạo newsfeed
        await NewsFeed.createNewsFeed(req.portal, {
            title: log?.title,
            description: log?.description,
            creator: req.user._id,
            taskId: tasks?._id,
            relatedUsers: data?.users
        });

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: {
                task: task.newTask,
                taskLog
            }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
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
        let oldTask = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        let task = await PerformTaskService.editTaskByAccountableEmployees(req.portal, req.body.data, req.params.taskId);
        let user = task.user;
        let tasks = task.tasks;
        let data = {
            "organizationalUnits": tasks.organizationalUnit,
            "title": "Cập nhật thông tin công việc",
            "level": "general",
            "content": `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${tasks?.name}</a> với vai trò người phê duyệt</p>`,
            "sender": user.name,
            "users": tasks.responsibleEmployees,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${tasks.name}:</strong> ${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt</p>`
            }
        };
        NotificationServices.createNotification(req.portal, tasks.organizationalUnit, data);
        let title = "Cập nhật thông tin công việc: " + task.tasks.name;
        sendEmail(task.email, title, '', `<p><strong>${user.name}</strong> đã cập nhật thông tin công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${tasks?.name}</a> với vai trò người phê duyệt</p>`);
        

        // Gửi mail cho trưởng đơn vị phối hợp thực hiện công việc
        let deletedCollabEmail = task.deletedCollabEmail;
        let deletedCollabHtml = task.deletedCollabHtml;
        let deletedCollabData = {
            organizationalUnits: task.newTask.organizationalUnit._id,
            title: "Xóa đơn vị phối hợp công việc",
            level: "general",
            content: deletedCollabHtml,
            sender: task.newTask.organizationalUnit.name,
            users: task.managersOfDeletedCollab,
            associatedDataObject: {
                dataType: 1,
                description: `<p>Đơn vị của bạn đã bị xóa khỏi công việc: <strong>${tasks.name}:</strong>.</p>`
            }
        };

        await NotificationServices.createNotification(req.portal, tasks.organizationalUnit.company, deletedCollabData);
        deletedCollabEmail && deletedCollabEmail.length !== 0
            && await sendEmail(deletedCollabEmail, "Đơn vị bạn bị xóa khỏi các đơn vị phối hợp thực hiện công việc mới", '', deletedCollabHtml);
        
        let additionalCollabEmail = task.additionalCollabEmail;
        let additionalCollabHtml = task.additionalCollabHtml;
        let additionalCollabData = {
            organizationalUnits: task.newTask.organizationalUnit._id,
            title: "Mời làm đơn vị phối hợp công việc",
            level: "general",
            content: additionalCollabHtml,
            sender: task.newTask.organizationalUnit.name,
            users: task.managersOfAdditionalCollab,
            associatedDataObject: {
                dataType: 1,
                description: `<p>Đơn vị bạn được mời phối hợp thực hiện trong công việc: <strong>${tasks.name}</strong> </p>`
            }
        };

        await NotificationServices.createNotification(req.portal, tasks.organizationalUnit.company, additionalCollabData);
        additionalCollabEmail && additionalCollabEmail.length !== 0
            && await sendEmail(additionalCollabEmail, "Đơn vị bạn được mời phối hợp thực hiện công việc mới", '', additionalCollabHtml);
        
        let description = await PerformTaskService.createDescriptionEditTaskLogs(req.portal, req.user._id, task.newTask, oldTask);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin công việc theo vai trò người phê duyệt",
            description: description
        }
        let taskLog = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);

        // Tạo newsfeed
        await NewsFeed.createNewsFeed(req.portal, {
            title: log?.title,
            description: log?.description,
            creator: req.user._id,
            taskId: tasks?._id,
            relatedUsers: data?.users
        });
        deletedCollabEmail && deletedCollabEmail.length !== 0
            && await NewsFeed.createNewsFeed(req.portal, {
                title: deletedCollabData?.title,
                description: deletedCollabData?.content,
                creator: req.user._id,
                taskId: tasks?._id,
                relatedUsers: deletedCollabData?.users
            });
        additionalCollabEmail && additionalCollabEmail.length !== 0
            && await NewsFeed.createNewsFeed(req.portal, {
                title: additionalCollabData?.title,
                description: additionalCollabData?.content,
                creator: req.user._id,
                taskId: tasks?._id,
                relatedUsers: additionalCollabData?.users
            });

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: {
                task: task.newTask,
                taskLog
            }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_fail'],
            content: error
        });
    }
}

/** Chỉnh sửa đơn vị phối hợp */
editEmployeeCollaboratedWithOrganizationalUnits = async (req, res) => {
    try {
        let data = await PerformTaskService.editEmployeeCollaboratedWithOrganizationalUnits(req.portal, req.params.taskId, req.body);
        
        // Thêm nhật ký hoạt động
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Phân công công việc",
            description: data.descriptionLogs
        }
        await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);

        // Gửi thông báo
        let notification = {
            organizationalUnits: data.task && data.task.organizationalUnit._id,
            title: "Phân công công việc",
            level: "general",
            content: data.html,
            sender: data.task && data.task.organizationalUnit.name,
            users: data.newEmployees,
            associatedDataObject: {
                dataType: 1,
                description: `<p><strong>${data.task.name}:</strong> Cập nhật đơn vị phối hợp</p>`
            }
        };
        await NotificationServices.createNotification(req.portal, data.task.organizationalUnit.company, notification);
        data.email && data.email.length !== 0
            && await sendEmail(data.email, "Phân công công việc", '', data.html);

        await Logger.info(req.user.email, ` edit collaborate with organizational unit `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_employee_collaborated_success'],
            content: data.task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit collaborate with organizational unit `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_employee_collaborated_failure'],
            content: error
        });
    }
}

/** Chỉnh sửa taskInformation của task */
exports.editTaskInformation = async (req, res) => {
    try {
        let task = await PerformTaskService.editTaskInformation(req.portal, req.params.taskId, req.user._id, req.body);

        await Logger.info(req.user.email, ` edit task information `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_task_information_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task information `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_task_information_failure'],
            content: error
        });
    }
}


/**
 * evaluate task by consulted employee
 */
evaluateTaskByConsultedEmployees = async (req, res) => {
    try {
        const data = req.body.data;
        let oldTask = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        let task = await PerformTaskService.evaluateTaskByConsultedEmployees(req.portal, data, req.params.taskId);
        
        // Thêm nhật ký hoạt động
        let description = await PerformTaskService.createDescriptionEvaluationTaskLogs(req.portal, req.user._id, data, oldTask);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin đánh giá công việc tháng " + data?.evaluatingMonth?.slice(3) + " theo vai trò người tư vấn",
            description: description
        }
        let taskLog = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);

        // Tạo newsfeed
        await NewsFeed.createNewsFeed(req.portal, {
            title: log?.title,
            description: log?.description,
            creator: req.user._id,
            taskId: task?._id,
            relatedUsers: task?.accountableEmployees?.map(item => item?._id)
        });

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: {
                task,
                taskLog
            }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
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
        const data = req.body.data;
        let oldTask = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        let task = await PerformTaskService.evaluateTaskByResponsibleEmployees(req.portal, data, req.params.taskId);

        // Thêm nhật ký hoạt động
        let description = await PerformTaskService.createDescriptionEvaluationTaskLogs(req.portal, req.user._id, data, oldTask);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin đánh giá công việc tháng " + data?.evaluatingMonth?.slice(3) + " theo vai trò người thực hiện",
            description: description
        }
        let taskLog = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);
        
        // Tạo newsfeed
        await NewsFeed.createNewsFeed(req.portal, {
            title: log?.title,
            description: log?.description,
            creator: req.user._id,
            taskId: task?._id,
            relatedUsers: task?.accountableEmployees?.map(item => item?._id)
        });

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: {
                task,
                taskLog
            }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
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
        const data = req.body.data;
        let oldTask = await PerformTaskService.getTaskById(req.portal, req.params.taskId, req.user._id);
        let task = await PerformTaskService.evaluateTaskByAccountableEmployees(req.portal, data, req.params.taskId);
        
        // Thêm nhật ký hoạt động
        let description = await PerformTaskService.createDescriptionEvaluationTaskLogs(req.portal, req.user._id, data, oldTask);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin đánh giá công việc tháng " + data?.evaluatingMonth?.slice(3) + " theo vai trò người phê duyệt",
            description: description
        }
        let taskLog = await PerformTaskService.addTaskLog(req.portal, req.params.taskId, log);

        // Tạo newsfeed
        await NewsFeed.createNewsFeed(req.portal, {
            title: log?.title,
            description: log?.description,
            creator: req.user._id,
            taskId: task?._id,
            relatedUsers: task?.accountableEmployees?.map(item => item?._id).filter(item => item !== req.user._id)
        });


        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: {
                task,
                taskLog
            }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
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
editHoursSpentInEvaluate = async (req, res) => {
    try {
        let task = await PerformTaskService.editHoursSpentInEvaluate(req.portal, req.body.data, req.params.taskId);

        await Logger.info(req.user.email, ` edit task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_hours_spent_in_evaluate_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_hours_spent_in_evaluate_fail'],
            content: error
        });
    }
}


/**
 * delete evaluation by id
 */
exports.deleteEvaluation = async (req, res) => {
    try {
        let task = await PerformTaskService.deleteEvaluation(req.portal, req.params);
        await Logger.info(req.user.email, ` delete evaluation  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_evaluation_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete evaluation `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_evaluation_fail'],
            content: error
        });
    }
}


/**
 * Chinh sua trang thai luu kho cua cong viec
 */
editArchivedOfTask = async (req, res) => {
    try {
        let task = await PerformTaskService.editArchivedOfTask(req.portal, req.params.taskId);
        await Logger.info(req.user.email, ` edit status archived of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_archived_of_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit status of task `, req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)? error: ['edit_status_archived_of_task_fail'],
            content: error
        });
    }
}

/**
 * Chinh sua trang thai cua cong viec
 */
editActivateOfTask = async (req, res) => {
    try {
        let data = await PerformTaskService.editActivateOfTask(req.portal, req.params.taskId, req.body);
        let task = data.task;
        let mails = data.mailInfo;
        for (let i in mails) {
            let task = mails[i].task;
            let user = mails[i].user;
            let email = mails[i].email;
            let html = mails[i].html;

            let mailData = {
                "organizationalUnits": task.organizationalUnit._id,
                "title": "Kích hoạt công việc",
                "level": "general",
                "content": html,
                "sender": task.organizationalUnit.name,
                "users": user,
                associatedDataObject: {
                    dataType: 1,
                    description: `<p><strong>${data.task.name}:</strong> ${req.user.name} đã cập nhật trạng thái công việc</p>`
                }
            };
            NotificationServices.createNotification(req.portal, task.organizationalUnit.company, mailData,);
            sendEmail(email, "Kích hoạt công việc hành công", '', html);
        }
        await Logger.info(req.user.email, ` edit activate of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_status_of_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit activate of task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_status_of_task_fail'],
            content: error
        });
    }
}

/** Xác nhận công việc */
confirmTask = async (req, res) => {
    try {
        let task = await PerformTaskService.confirmTask(req.portal, req.params.taskId, req.user._id);

        await Logger.info(req.user.email, ` confirm task `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['confirm_task_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` confirm task `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['confirm_task_failure'],
            content: error
        })
    }
}

/** Yêu cầu kết thúc công việc */
requestAndApprovalCloseTask = async (req, res) => {
    try {
        let data = {
            ...req.body,
            userId: req.user._id
        }
        let task = await PerformTaskService.requestAndApprovalCloseTask(req.portal, req.params.taskId, data);

        let dataNotification, email = [];

        dataNotification = {
            "organizationalUnits": task?.organizationalUnit?._id,
            "level": "general",
            associatedDataObject: {
                dataType: 1
            }
        };
        
        if (data.type === 'request') {
            dataNotification = {
                ...dataNotification,
                "title": "Yêu cầu kết thúc công việc",
                "sender": req.user.name,
                "users": task?.accountableEmployees.map(item => item._id),
                "content": `<strong>Công viêc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a>: </strong><span>${req.user.name} đã gửi yêu cầu kết thúc công việc</span>`,
                associatedDataObject: {
                    ...dataNotification.associatedDataObject,
                    description: `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a></strong><p>${req.user.name} đã gửi yêu cầu kết thúc công việc</p>`
                }
            };

            email = task?.accountableEmployees.map(item => item.email);
        } 
        else if (data.type === 'cancel_request') {
            dataNotification = null;
        }
        else if (data.type === 'approval') {
            dataNotification = {
                ...dataNotification,
                "title": "Phê duyệt kết thúc công việc",
                "sender": req.user.name,
                "users": task?.responsibleEmployees.map(item => item._id),
                "content": `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a>: </strong><span>Yêu cầu kết thúc công việc đã được phê duyệt thành công</span>`,
                associatedDataObject: {
                    ...dataNotification.associatedDataObject,
                    description: `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a></strong><p>Yêu cầu kết thúc công việc đã được phê duyệt thành công</p>`
                }
            };

            email = task.responsibleEmployees.map(item => item.email);
        }
        else if (data.type === 'decline') {
            dataNotification = {
                ...dataNotification,
                "title": "Từ chối kết thúc công việc",
                "sender": req.user.name,
                "users": task?.responsibleEmployees.map(item => item._id),
                "content": `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a>: </strong><span>Yêu cầu kết thúc công việc không được phê duyệt</span>`,
                associatedDataObject: {
                    ...dataNotification.associatedDataObject,
                    description: `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a></strong><p>Yêu cầu kết thúc công việc không được phê duyệt</p>`
                }
            };

            email = task.responsibleEmployees.map(item => item.email);
        }

        if (dataNotification) {
            NotificationServices.createNotification(req.portal, task?.organizationalUnit?._id, dataNotification);
            sendEmail(email, dataNotification.title, '', dataNotification.content);
        }

        dataNotification && await NewsFeed.createNewsFeed(req.portal, {
            title: dataNotification?.title,
            description: dataNotification?.content,
            creator: req.user._id,
            taskId: task?._id,
            relatedUsers: dataNotification?.users
        });

        let message = data?.type + '_close_task_success';
        await Logger.info(req.user.email, ` request close task `, req.portal);
        res.status(200).json({
            success: true,
            messages: [message],
            content: task
        })
    } catch (error) {
        let message = data?.type + '_close_task_failure';
        await Logger.error(req.user.email, ` request close task `, req.portal);
        res.status(400).json({
            success: false,
            messages: [message],
            content: error
        })
    }
}

/** Mở lại công việc */
openTaskAgain = async (req, res) => {
    try {
        let data = {
            ...req.body,
            userId: req.user._id
        }
        let task = await PerformTaskService.openTaskAgain(req.portal, req.params.taskId, data);

        let dataNotification, user = {
            _id: [],
            email: []
        };

        task?.responsibleEmployees.map(item => {
            user._id = user._id.concat(item._id)
            user.email = user.email.concat(item.email)
        });
        task?.accountableEmployees.map(item => {
            user._id = user._id.concat(item._id)
            user.email = user.email.concat(item.email)
        });
        task?.consultedEmployees.map(item => {
            user._id = user._id.concat(item._id)
            user.email = user.email.concat(item.email)
        });
        task?.informedEmployees.map(item => {
            user._id = user._id.concat(item._id)
            user.email = user.email.concat(item.email)
        });

        user._id = user._id.concat(task?.creator?._id)
        user.email = user.email.concat(task?.creator?.email)

        user._id = new Set(user._id);
        user._id = Array.from(new Set(user._id));
        user.email = new Set(user.email);
        user.email = Array.from(new Set(user.email));

        dataNotification = {
            "organizationalUnits": task?.organizationalUnit?._id,
            "level": "general",
            "title": "Kích hoạt lại công việc",
            "sender": req.user.name,
            "users": user._id,
            "content": `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a>: </strong><span>${req.user.name} đã kích hoạt lại công việc</span>`,
            associatedDataObject: {
                dataType: 1,
                description: `<strong>Công việc <a href="${process.env.WEBSITE}/task?taskId=${req.params.taskId}">${task?.name}</a></strong><p>${req.user.name} đã kích hoạt lại công việc</p>`
            }
        };

        if (dataNotification) {
            NotificationServices.createNotification(req.portal, task?.organizationalUnit?._id, dataNotification);
            sendEmail(user.email, dataNotification.title, '', dataNotification.content);
        }

        await Logger.info(req.user.email, ` open task again `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['open_task_again_success'],
            content: task
        })
    } catch (error) {
        await Logger.error(req.user.email, ` open task again `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['open_task_again_failure'],
            content: error
        })
    }
}

/**
 * Xóa tai lieu
 */
exports.deleteDocument = async (req, res) => {
    try {
        let file = await PerformTaskService.deleteDocument(req.portal, req.params);
        await Logger.info(req.user.email, ` delete document of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_document_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete document of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_document_task_comment_fail'],
            content: error
        })
    }
}

/**
 * Sua tai lieu
 */
exports.editDocument = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path, description: req.body.description, creator: req.body.creator })

            })
        }
        let file = await PerformTaskService.editDocument(req.portal, req.params.taskId, req.query.documentId, req.body, files);
        await Logger.info(req.user.email, ` delete document of task  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_document_task_comment_success'],
            content: file
        })
    } catch (error) {
        await Logger.error(req.user.email, `delete document of task  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_document_task_comment_failure'],
            content: error
        })
    }
}


/**
 * Tạo comment trong trang create KPI employee
 */
exports.createComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.createComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_comment_fail'],
            content: error
        });
    }
}


/**
 * 
 *Sửa comment trong trang create KPI employee
 */
exports.editComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comments = await PerformTaskService.editComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_comment_fail'],
            content: error
        });
    }
}

/**
 * Xóa comment trong trang create KPI employee
 */
exports.deleteComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment kpi`, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment kpi `, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_fail'],
            content: error
        })
    }
}
/**
 * 
 * Tạo comment trong comment trong trang create KPI employee (tạo replied comment)
 */
exports.createChildComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.createChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_child_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create child comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_child_comment_fail'],
            content: error
        });
    }
}


/**
 * Sửa 1 comment trong trang create KPI employee (xóa comment replied)
 */
exports.editChildComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await PerformTaskService.editChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['edit_comment_of_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa comment của commnent trong trang create KPI employee (xóa comment replied)
 */
exports.deleteChildComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_child_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_child_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của comment
 */
exports.deleteFileComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteFileComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file child comment
 */
exports.deleteFileChildComment = async (req, res) => {
    try {
        var comments = await PerformTaskService.deleteFileChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file child comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: { task: comments, taskId: req.params.taskId }
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file child comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}

/**
 * Lấy tất cả preceeding task
 */
exports.getAllPreceedingTasks = async (req, res) => {
    try {
        let tasks = await PerformTaskService.getAllPreceedingTasks(req.portal, req.params);
        await Logger.info(req.user.email, ` get all preceeding tasks  `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_preceeding_tasks_success'],
            content: tasks
        })
    } catch (error) {
        await Logger.error(req.user.email, `get all preceeding tasks  `, req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_preceeding_tasks_fail'],
            content: error
        })
    }
}

exports.sortActions = async (req, res) => {
    try {
        var action = await PerformTaskService.sortActions(req.portal, req.params, req.body);
        await Logger.info(req.user.email, ` sort actions `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['sort_actions_success'],
            content: action
        })
    } catch (error) {
        await Logger.error(req.user.email, ` sort actions  `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['sort_actions_fail'],
            content: error
        })
    }
}