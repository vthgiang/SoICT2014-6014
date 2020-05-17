const PerformTaskService = require('./taskPerform.service');
const {  LogInfo,  LogError } = require('../../../logs');

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
        res.status(200).json({
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
        res.status(200).json({
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

// TODO: Bỏ service này
// Tạm dừng bấm giờ
exports.pauseTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.pauseTimesheetLog(req.params,req.body);
        await LogInfo(req.user.email, ` pause timer `,req.user.company);
        res.status(200).json({
            success: true ,
            messages : ['pause_timer_success'],
            content : timerStatus
        })
    } catch (error) {
        await LogError(req.user.email, ` pause timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages : ['pause_timer_fail'],
            content : error
        })
    }
}

// Tiếp tục bấm giờ
exports.continueTimesheetLog = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.continueTimesheetLog(req.params,req.body);
        await(req.user.email, ` continue timer `,req.user.company)
        res.status(200).json({
            success : true,
            messages : ['continue_timer_success'],
            content : timerStatus
        })
    } catch (error) {
        await LogError(req.user.email, ` continue timer `,req.user.company)
        res.status(400).json({
            success : false , 
            messages : ['continue_timer_fail'],
            content : error
        })
    }
}

// Kết thúc bấm giờ
exports.stopTimesheetLog = async (req, res) => {
    try {
        var timer = await PerformTaskService.stopTimesheetLog(req.params,req.body);
        await LogInfo(req.user.email, ` stop timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['stop_timer_success'],
            content : timer
        })
    } catch (error) {
        await LogError(req.user.email, ` stop timer `,req.user.company)
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
        res.json({
            success : true,
            messages: ["create_result_task_success"],
            content: task
        });
    } catch (error) {
        await LogError(req.user.email, ` create result of task  `,req.user.company);
        res.json({ 
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
        res.json({
            success: true,
            message: ['edit_result_task_success'],
            content: listResultTask
        });
    } catch (error) {
        await LogError(req.user.email, ` edit result of task  `,req.user.company);
        res.json({
            success: false,
            message: ['edit_result_task_fail'],
            content: error
        });
    }
}

//
exports.getTaskActions = async (req, res) => {
    try {
        var taskActions = await PerformTaskService.getTaskActions(req.params.task);
        //await LogInfo(req.user.email, ` get all task actions  `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['get_task_actions_success'],
            content : taskActions
        })
    } catch (error) {
        //await LogError(req.user.email, ` get all task actions  `,req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_task_actions_fail'],
            content : error
        })
    }
}

exports.createTaskAction = async (req,res) => {
    try {
        var taskAction = await PerformTaskService.createTaskAction(req.body);
        //await LogInfo(req.user.email, ` create task action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_task_action_success'],
            content : taskAction
        })
    } catch (error) {
        //await LogError(req.user.email, ` create task action  `,req.user.company)
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
        console.log("ahahahhahahahahahahaha")
        var taskAction = await PerformTaskService.editTaskAction(req.query.edit,req.body);
        //await LogInfo(req.user.email, ` edit task action  `,req.user.company)
        res.status(200).json({
            success: true,
            messages : ['edit_task_action_success'],
            content : taskAction
        })
    } catch (error) {
        //await LogError(req.user.email, ` edit task action  `,req.user.company)
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
        //await LogInfo(req.user.email, ` delete task action  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success'],
            content: taskAction
        })
    } catch (error) {
        //await LogError(req.user.email, ` delete task action  `,req.user.company);
        res.status(400).json({
            success: false,
            messages : ['delete_task_action_fail'],
            content : error
        })
    }
}
// Lấy tất cả bình luận và hoạt động của một công việc
exports.getCommentsOfTaskAction =async (req, res) => {
    try {
        var actionComments = await PerformTaskService.getCommentsOfTaskAction(req.params)
        await LogInfo(req.user.email, ` get all action comments  `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['get_action_comments_success'],
            content: actionComments
        })
    } catch (error) {
        await LogError(req.user.email, ` get all action comments  `,req.user.company);
        res.status(400).json({
            success: false,
            messages:['get_action_comments_fail'],
            content : error
        })
    }
 }
 
 // Tạo một bình luận hoặc hoạt động cho công việc
 exports.createCommentOfTaskAction = async (req, res) => {
     try {
        var actionComment = await PerformTaskService.createCommentOfTaskAction(req.body);
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
        var actionComment = await PerformTaskService.editCommentOfTaskAction(req.params,req.body);
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
        //await LogInfo(req.user.email, ` delete action comment  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
            content : task
        })
    } catch (error) {
        //await LogError(req.user.email, ` delete action comment  `,req.user.company)
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
        var taskComment = await PerformTaskService.createTaskComment(req.body);
        res.status(200).json({
            success: true,
            messages : "Tajo thafnh cong",
            content : taskComment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: "Tao that bai"
        })
    }
}
/**
 * Lấy tất cả bình luận công việc
 */
exports.getTaskComments = async(req,res) => {
    try {
        var taskComment = await PerformTaskService.getTaskComments(req.params);
        res.status(200).json({
            success: true,
            messages: ['Lay thanh cong'],
            content : taskComment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Lay that bai'],
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
        res.status(200).json({
            success: true,
            messages: ['Edit thanh cong'],
            content : taskComment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Edit that bai'],
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
        res.status(200).json({
            success: true,
            messages: ['Xoa thanh cong'],
            content : taskComment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Xoa that bai'],
            content : error
        })
    }
}
/**
 * Tạo bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (req,res) => {
    try {
        var comment = await PerformTaskService.createCommentOfTaskComment(req.body);
        res.status(200).json({
            success: true,
            messages: ['Tao thanh cong'],
            content: comment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Tao that bai'],
            content: error
        })
    }
}
/**
 * Suửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async(req,res) => {
    try {
        console.log("HHAHHA")
        var comment = await PerformTaskService.editCommentOfTaskComment(req.params,req.body);
        res.status(200).json({
            success: true,
            messages: ['Sua thanh cong'],
            content: comment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Sua that bai'],
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
        res.status(200).json({
            success: true,
            messages: ['Xoa thanh cong'],
            content: comment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Xoa that bai'],
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
        res.status(200).json({
            success: true,
            messages: ['Danh gia thanh cong'],
            content: taskAction
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['Danh gia that bai'],
            content: error
        })
    }
}