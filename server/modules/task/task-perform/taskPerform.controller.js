const PerformTaskService = require('./taskPerform.service');
const {  LogInfo,  LogError } = require('../../../logs');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc
// Lấy tất tả lịch sử bấm giờ của một công việc
exports.getLogTimer = async (req, res) => {
    try {
        var logTimer = await PerformTaskService.getLogTimer(req.params);
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
exports.getTimerStatus = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.getTimerStatus(req.params);
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
exports.startTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.startTimer(req.body);
        await LogInfo(req.user.email, ` start timer `,req.user.company)
        res.status(200).json({
            success: true,
            messages:['start_timer_success'],
            content : timerStatus
        })
    } catch (error) {
        await LogError(req.user.email, ` start timer `,req.user.company)
        res.status(400).json({
            success: false,
            messages :['start_timer_fail'],
            content :error
        })
    }
}

// Tạm dừng bấm giờ
exports.pauseTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.pauseTimer(req.params,req.body);
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
exports.continueTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.continueTimer(req.params,req.body);
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
exports.stopTimer = async (req, res) => {
    try {
        var timer = await PerformTaskService.stopTimer(req.params,req.body);
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
exports.createResultInformationTask = async (req, res) => {
    try {
        var task =  await PerformTaskService.createResultInformationTask(req.body);
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
exports.editResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = await PerformTaskService.editResultInformationTask(req.body);
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
exports.createResultTask = async (req, res) => {
    try {
        var task = await PerformTaskService.createResultTask(req.body.result,req.body.task, req.body.evaluateID, req.body.date);
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
exports.editResultTask = async (req, res) => {
    try {
        var listResultTask = await PerformTaskService.editResultTask(req.body, req.params.id);
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
        await LogInfo(req.user.email, ` get all task actions  `,req.user.company);
        res.status(200).json({
            success: true,
            messages : ['get_task_actions_success'],
            content : taskActions
        })
    } catch (error) {
        await LogError(req.user.email, ` get all task actions  `,req.user.company);
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
    try {
        var taskAction = await PerformTaskService.editTaskAction(req.params,req.body);
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
        await PerformTaskService.deleteTaskAction(req.params);
        await LogInfo(req.user.email, ` delete task action  `,req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_task_action_success']
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
// Lấy tất cả bình luận và hoạt động của một công việc
exports.getActionComments =async (req, res) => {
    try {
        var actionComments = await PerformTaskService.getActionComments(req.params)
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
 exports.createActionComment = async (req, res) => {
     try {
        var actionComment = await PerformTaskService.createActionComment(req.body);
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
exports.editActionComment = async (req, res) => {
    try {
        var actionComment = await PerformTaskService.editActionComment(req.params,req.body);
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
exports.deleteActionComment = async (req, res) => {
    try {
        await PerformTaskService.deleteActionComment(req.params);
        await LogInfo(req.user.email, ` delete action comment  `,req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_action_comment_success'],
        })
    } catch (error) {
        await LogError(req.user.email, ` delete action comment  `,req.user.company)
        res.status(400).json({
            success: false,
            messages : ['delete_action_comment_fail']
        })
    }


}
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

