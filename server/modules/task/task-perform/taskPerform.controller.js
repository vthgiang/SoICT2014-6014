const PerformTaskService = require('./taskPerform.service');
const {  LogInfo,  LogError } = require('../../../logs');
const NotificationServices = require('../../notification/notification.service');
const { sendEmail } = require('../../../helpers/emailHelper');
// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc
// Lấy tất tả lịch sử bấm giờ của một công việc
exports.getTaskTimesheetLogs = async (req, res) => {
    try {
        var logTimer = await PerformTaskService.getTaskTimesheetLogs(req.params);
        await LogInfo(req.user.email, ` get log timer  `,req.user.company)
        res.status(200).json({
            success: true,
            messages : ['get_log_timer_success'],
            content : logTimer
        })
    } catch (error) {
        await LogError(req.user.email, ` get log timer  `,req.user.company)
        res.status(400).json({
            success: false,
            messages :['get_log_timer_fail'],
            content : error
        })
    }
}

// Lấy trạng thái bấm giờ hiện tai (chưa kết thúc)
exports.getActiveTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.getActiveTimesheetLog(req.params);
        await LogInfo(req.user.email, ` get timer status `,req.user.company)
        res.status(200).json({
            success: true,
            messages : ['get_timer_status_success'],
            content : timerStatus
        })
    } catch (error) {
        await LogError(req.user.email, ` get timer status `,req.user.company)
        res.status(400).json({
            success: false,
            messages :['get_timer_status_fail'],
            content : error
        })
    }
}

// Bắt đầu bấm giờ
exports.startTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.startTimesheetLog(req.body);
        //await LogInfo(req.user.email, ` start timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages:['start_timer_success'],
            content : timerStatus
        })
    } catch (error) {
        //await LogError(req.user.email, ` start timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages :['start_timer_fail'],
            content :error
        })
    }
}

// Kết thúc bấm giờ
exports.stopTimesheetLog = async (req, res) => {
    try {
        var timer = await PerformTaskService.stopTimesheetLog(req.body);
        //await LogInfo(req.user.email, ` stop timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['stop_timer_success'],
            content : timer
        })
    } catch (error) {
        //await LogError(req.user.email, ` stop timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages : ['stop_timer_fail'],
            content : error
        })
    }
    

}

// Test thêm 1 kết quả nhập liệu cho thông tin mẫu công việc
// thang nay hinh nhu thua`
exports.createResultInfoTask = async (req, res) => {
    try {
        var resultInfoTask = await  PerformTaskService.createResultInfoTask(req.body)
        res.status(200).json({
            success : true,
            messages : "Them result info task",
            content : resultInfoTask
        })    
    } catch (error) {
        res.status(400).json({
            success : false,
            messages : "Them result info task",
            content : error
        })
    }
}

// Thêm dữ liệu nhập liệu cho thông tin mẫu công việc
exports.createTaskInformation = async (req, res) => {
    try {
        var task =  await PerformTaskService.createTaskInformation(req.body);
        await LogInfo(req.user.email, ` create result infomation task `,req.user.company)
        res.status(200).json({
            success : true,
            messages : ['create_result_infomation_task_success'],
            content : task
        })
    } catch (error) {
        await LogError(req.user.email, ` create result infomation task `,req.user.company)
        res.status(400).json({
            success : false,
            messages : ['create_result_infomation_task_fail'],
            content : error
        })
    }
}

// Chỉnh sửa dữ liệu nhập liệu cho thông tin mẫu công việc
exports.editTaskInformation = async (req, res) => {
    try {
        var listResultInfoTask = await PerformTaskService.editTaskInformation(req.body);
        await LogInfo(req.user.email, ` edit result infomation task `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['edit_result_infomation_task_success'],
            content : listResultInfoTask
        })
    } catch (error) {
        await LogError(req.user.email, ` edit result infomation task `,req.user.company)
        res.status(400).json({
            success : false,
            messages : ['edit_result_infomation_task_fail'],
            content : error
        })
    }
}

// Thêm kết quả đánh giá công việc cho từng người tham gia
exports.createTaskResult = async (req, res) => {
    try {
        var task = await PerformTaskService.createTaskResult(req.body.result,req.body.task, req.body.evaluateID, req.body.date);
        await LogInfo(req.user.email, ` edit result of task  `,req.user.company);
        res.status(200).json({
            success : true,
            messages: ["create_result_task_success"],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` create result of task  `,req.user.company);
        res.status(400).json({ 
            success: false,
            messages: ['create_result_task_fail'],
            content: error 
        });
    }
}

// Chỉnh sửa kết quả đánh giá công việc cho từng người tham gia listResult, taskID
exports.editTaskResult = async (req, res) => {
    try {
        var listResultTask = await PerformTaskService.editTaskResult(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit result of task  `,req.user.company);
        res.status(200).json({
            success: true,
            message: ['edit_result_task_success'],
            content: listResultTask
        });
    } catch (error) {
        await LogError(req.user.email, ` edit result of task  `,req.user.company);
        res.status(400).json({
            success: false,
            message: ['edit_result_task_fail'],
            content: error
        });
    }
}
exports.createTaskAction = async (req,res) => {
    try {
        var files=[] ;
        
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        
        var task = await PerformTaskService.createTaskAction(req.body,files);
        var taskAction = task.taskActions;
        var tasks = task.tasks;
        var user = task.user;
        var data = {"organizationalUnits" : tasks.organizationalUnit,"title" : "Phê duyệt hoạt động","level" : "general","content":`${user.name} đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này `,"sender": tasks.name,"users": tasks.accountableEmployees};
        NotificationServices.createNotification(tasks.organizationalUnit, data, );
        sendEmail("vnist.qlcv@gmail.com",task.email,"Phê duyệt hoạt động",'',`<p>${user.name} đã thêm mới hoạt động, bạn có thể vào để phê duyệt hoạt động này <a href="${process.env.WEBSITE}/task?taskId=${tasks._id}">${process.env.WEBSITE}/task?taskId=${tasks._id}</a></p>`);
        await LogInfo(req.user.email, ` create task action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_task_action_success'],
            content : taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` create task action  `,req.user.company)
        res.status(400).json({
            success: false,
            messages :['create_task_action_fail'],
            content :error
        })
    }
}

exports.editTaskAction = async (req,res) =>{
    if(req.query.evaluation !== undefined){
        evaluationAction(req,res);
    }else
    try {
        var files=[] ;
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var taskAction = await PerformTaskService.editTaskAction(req.query.edit,req.body,files);
        await LogInfo(req.user.email, ` edit task action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages : ['edit_task_action_success'],
            content : taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task action  `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['edit_task_action_fail'],
            content : error
        })
    }
}

exports.deleteTaskAction = async (req,res)=>{
    try {
        var taskAction = await PerformTaskService.deleteTaskAction(req.params);
        await LogInfo(req.user.email, ` delete task action  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` delete task action  `,req.user.company);
        res.status(400).json({
            success: false,
            messages : ['delete_task_action_fail'],
            content : error
        })
    }
}
 // Tạo một bình luận hoặc hoạt động cho công việc
 exports.createCommentOfTaskAction = async (req, res) => {
     try {
        var files=[] ;
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var actionComment = await PerformTaskService.createCommentOfTaskAction(req.body,files);
        await LogInfo(req.user.email, ` create  action comment  `,req.user.company);
        res.status(200).json({
             success: true,
             messages : ['create_action_comment_success'],
             content : actionComment
        })
     } catch (error) {
        await LogError(req.user.email, ` create  action comment  `,req.user.company);
        res.status(400).json({
             success:false,
             messages: ['create_action_comment_fail'],
             content: error
         })
     }
 }
// Chỉnh sửa một hoạt động hoặc bình luận
exports.editCommentOfTaskAction = async (req, res) => {
    try {
        var files=[] ;
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var actionComment = await PerformTaskService.editCommentOfTaskAction(req.params,req.body,files);
        await LogInfo(req.user.email, ` edit action comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['edit_action_comment_success'],
            content : actionComment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit action comment  `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_action_comment_fail'],
            content : error
        })
    }
}

// Xóa bỏ một bình luận hoặc hoạt động
exports.deleteCommentOfTaskAction = async (req, res) => {
    try {
        var task = await PerformTaskService.deleteCommentOfTaskAction(req.params);
        await LogInfo(req.user.email, ` delete action comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
            content : task
        })
    } catch (error) {
        await LogError(req.user.email, ` delete action comment  `,req.user.company);
        res.status(400).json({
            success: false,
            messages : ['delete_action_comment_fail'],
            content : error
        })
    }


}
/**
 * Tạo bình luận của công việc
 */
exports.createTaskComment = async (req,res) => {
    try {
        var files = [];
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var taskComment = await PerformTaskService.createTaskComment(req.body,files);
        await LogInfo(req.user.email, ` create task comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['create_task_comment_success'],
            content : taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` create task comment  `,req.user.company);
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
exports.editTaskComment = async(req,res) => {
    try {
        var taskComment = await PerformTaskService.editTaskComment(req.params,req.body);
        await LogInfo(req.user.email, ` edit task comments  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_comment_success'],
            content : taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task comments  `,req.user.company);
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
exports.deleteTaskComment = async (req,res) => {
    try {
        var taskComment = await PerformTaskService.deleteTaskComment(req.params);
        await LogInfo(req.user.email, ` delete task comments  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_comment_success'],
            content : taskComment
        })
    } catch (error) {
        await LogError(req.user.email, ` delete task comments  `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_task_comment_fail'],
            content : error
        })
    }
}
/**
 * Tạo bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (req,res) => {
    try {
        var files = [];
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path})
                
            })
        }
        var comment = await PerformTaskService.createCommentOfTaskComment(req.body,files);
        await LogInfo(req.user.email, ` create comment of task comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` create comment of task comment  `,req.user.company);
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
exports.editCommentOfTaskComment = async(req,res) => {
    try {
        var comment = await PerformTaskService.editCommentOfTaskComment(req.params,req.body);
        await LogInfo(req.user.email, ` edit comment of task comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` edit comment of task comment  `,req.user.company);
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
exports.deleteCommentOfTaskComment = async(req,res) => {
    try {
        var comment = await PerformTaskService.deleteCommentOfTaskComment(req.params);
        await LogInfo(req.user.email, ` delete comment of task comment  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_comment_of_task_comment_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, ` delete comment of task comment  `,req.user.company);
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
evaluationAction= async (req,res) => {
    try {
        var taskAction = await PerformTaskService.evaluationAction(req.query.evaluation,req.body);
        await LogInfo(req.user.email, ` evaluation action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['evaluation_action_success'],
            content: taskAction
        })
    } catch (error) {
        await LogError(req.user.email, ` evaluation action  `,req.user.company)
        res.status(400).json({
            success: false,
            messages: ['evaluation_action_fail'],
            content: error
        })
    }
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async(req,res) =>{
    try {
        var abc = await PerformTaskService.confirmAction(req.params);
        await LogInfo(req.user.email, ` confirm action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['confirm_action_success'],
            content: abc
        })
    } catch (error) {
        await LogError(req.user.email, ` confirm action  `,req.user.company)
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
exports.uploadFile = async(req,res) => {
    try {
        var files = [];
        if(req.files !== undefined){
            req.files.forEach((elem,index) => {
                var path = elem.destination +'/'+ elem.filename;
                files.push({name : elem.originalname, url: path,description : req.body.description,creator : req.body.creator})
                
            })
        }
        var comment = await PerformTaskService.uploadFile(req.params,files);
        await LogInfo(req.user.email, ` upload file of task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['upload_file_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, `upload file of task  `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['upload_file_fail'],
            content: error
        })
    }
}
/**
 * Xóa tài liệu công việc
 */
exports.deleteFile = async(req,res) => {
    try {
        var comment = await PerformTaskService.deleteFile(req.params);
        await LogInfo(req.user.email, ` delete file of task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_file_success'],
            content: comment
        })
    } catch (error) {
        await LogError(req.user.email, `delete file of task  `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['delete_file_fail'],
            content: error
        })
    }
}
/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async(req,res) => {
    try {
        var task = await PerformTaskService.addTaskLog(req.body);
        await LogInfo(req.user.email, ` CREATE_TASK_LOG  `, req.user.company);
        res.status(200).json({
            success : true,
            messages: ["create_task_log_success"],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` CREATE_TASK_LOG  `,req.user.company);
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
exports.getTaskLog = async(req,res) => {
    try {
        var taskLog = await PerformTaskService.getTaskLog(req.params.id);
        await LogInfo(req.user.email, ` GET_TASK_LOG  `, req.user.company);
        res.status(200).json({
            success : true,
            messages: ["get_task_log_success"],
            content: taskLog
        });
    } catch (error) {
        await LogError(req.user.email, ` GET_TASK_LOG  `,req.user.company);
        res.status(400).json({ 
            success: false,
            messages: ['get_task_log_fail'],
            content: error 
        });
    }
}

/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (req, res) => {
    try {
        var task = await PerformTaskService.editTaskByResponsibleEmployees(req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = {"organizationalUnits" : tasks.organizationalUnit,"title" : "Cập nhật thông tin công việc","level" : "general","content":`${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`,"sender": tasks.name,"users": tasks.accountableEmployees};
        NotificationServices.createNotification(tasks.organizationalUnit, data, );
        sendEmail("vnist.qlcv@gmail.com",task.email,"Cập nhật thông tin công việc",'',`<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await LogInfo(req.user.email, ` edit task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `,req.user.company);
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
        var task = await PerformTaskService.editTaskByAccountableEmployees(req.body, req.params.id);
        var user = task.user;
        var tasks = task.tasks;
        var data = {"organizationalUnits" : tasks.organizationalUnit,"title" : "Cập nhật thông tin công việc","level" : "general","content":`${user.name} đã cập nhật thông tin công việc với vai trò người phê duyệt`,"sender": tasks.name,"users": tasks.responsibleEmployees};
        NotificationServices.createNotification(tasks.organizationalUnit, data, );
        sendEmail("vnist.qlcv@gmail.com",task.email,"Cập nhật thông tin công việc",'',`<p><strong>${user.name}</strong> đã cập nhật thông tin công việc với vai trò người phê duyệt <a href="${process.env.WEBSITE}/task?taskId=${req.params.id}">${process.env.WEBSITE}/task?taskId=${req.params.id}</a></p>`);
        await LogInfo(req.user.email, ` edit task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_task_success'],
            content: task.newTask
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `,req.user.company);
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
        var task = await PerformTaskService.evaluateTaskByConsultedEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `,req.user.company);
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
        var task = await PerformTaskService.evaluateTaskByResponsibleEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `,req.user.company);
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
        var task = await PerformTaskService.evaluateTaskByAccountableEmployees(req.body, req.params.id);
        await LogInfo(req.user.email, ` edit task  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['evaluate_task_success'],
            content: task
        })
    } catch (error) {
        await LogError(req.user.email, ` edit task `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['evaluate_task_fail'],
            content: error
        });
    }
}
