const PerformTaskService = require('./taskPerform.service');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc
// Lấy tất tả lịch sử bấm giờ của một công việc
exports.getLogTimer = async (req, res) => {
    try {
        var logTimer = await PerformTaskService.getLogTimer(req.params);
        res.status(200).json({
            success: true,
            messages : "",
            content : logTimer
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            messages :"",
            content : error
        })
    }
}

// Lấy trạng thái bấm giờ hiện tai (chưa kết thúc)
exports.getTimerStatus = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.getTimerStatus(req.params);
        res.status(200).json({
            success: true,
            messages : "",
            content : timerStatus
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            messages :"",
            content : error
        })
    }
}

// Bắt đầu bấm giờ
exports.startTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.startTimer(req.body);
        //log
        res.status(200).json({
            success: true,
            messages:"Bat dau thanh cong",
            content : timerStatus
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages :"start timer ẻoor",
            content :error
        })
    }
}

// Tạm dừng bấm giờ
exports.pauseTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.pauseTimer(req.params,req.body);
        //log
        res.status(200).json({
            success: true ,
            messages : "Tạm dừng tính giờ",
            content : timerStatus
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages : "Loi tam dung tinh gio",
            content : error
        })
    }
}

// Tiếp tục bấm giờ
exports.continueTimer = async (req, res) => {
    try {
        var timerStatus = await PerformTaskService.continueTimer(req.params,req.body);
        //log
        res.status(200).json({
            success : true,
            messages : "Tiếp tục tính giờ",
            content : timerStatus
        })
    } catch (error) {
        res.status(400).json({
            success : false , 
            messages : "Loi tiep tục tính giờ",
            content : error
        })
    }
}

// Kết thúc bấm giờ
exports.stopTimer = async (req, res) => {
    try {
        var timer = await PerformTaskService.stopTimer(req.params,req.body);
        //log
        res.status(200).json({
            success: true,
            messages: "Ket thuc bam gio",
            content : timer
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages : "Dung bam gio bi loi",
            content : error
        })
    }
    

}

// Test thêm 1 kết quả nhập liệu cho thông tin mẫu công việc
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
        res.status(200).json({
            success : true,
            messages : "Tao thanh cong",
            content : task
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            messages : "Tao that bai",
            content : error
        })
    }
}

// Chỉnh sửa dữ liệu nhập liệu cho thông tin mẫu công việc
exports.editResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = await PerformTaskService.editResultInformationTask(req.body);
        res.status(200).json({
            success: true,
            messages : " edit result infomation task",
            content : listResultInfoTask
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            messages : "Edit khong thanh cong",
            content : error
        })
    }
}

// Thêm kết quả đánh giá công việc cho từng người tham gia
exports.createResultTask = async (req, res) => {
    try {
        var task = await PerformTaskService.createResultTask(req.body.result,req.body.task);
        res.json({
            success : true,
            message: "Lưu thành công kết quả đánh giá",
            content: task
        });
    } catch (error) {
        res.json({ 
            success: false,
            message: "Lưu thất bại kết quả đánh giá",
            content: error 
        });
    }
    // return PerformTaskService.createResultTask(req, res);
}

// Chỉnh sửa kết quả đánh giá công việc cho từng người tham gia listResult, taskID
exports.editResultTask = async (req, res) => {
    try {
        var listResultTask = await PerformTaskService.editResultTask(req.body, req.params.id);
        // await LogInfo(req.user.email, ` edit result of task  `,req.user.company);
        res.json({
            success: true,
            message: "Chỉnh sửa thành công kết quả đánh giá",
            content: listResultTask
        });
    } catch (error) {
        // await LogError(req.user.email, ` edit result of task  `,req.user.company);
        res.json({
            success: false,
            message: "Chỉnh sửa thất bại kết quả đánh giá",
            content: error
            
        });
    }
}

//
exports.getTaskActions = async (req, res) => {
    try {
        var taskActions = await PerformTaskService.getTaskActions(req.params.task);
        //log
        res.status(200).json({
            success: true,
            messages : "get task action thanh cong",
            content : taskActions
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: "Loi get task action",
            content : error
        })
    }
}

exports.createTaskAction = async (req,res) => {
    try {
        var taskAction = await PerformTaskService.createTaskAction(req.body);
        //log
        res.status(200).json({
            success: true,
            messages: "Them task action thanh cong",
            content : taskAction
        })
    } catch (error) {
        //log
        res.status(400).json({
            success: false,
            messages :"Loi them task action",
            content :error
        })
    }
}

exports.editTaskAction = async (req,res) =>{
    try {
        var taskAction = await PerformTaskService.editTaskAction(req.params,req.body);
        //log
        res.status(200).json({
            success: true,
            messages : "Sua task action thanh cong",
            content : taskAction
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: "Sua task action that bai",
            content : error
        })
    }
}

exports.deleteTaskAction = async (req,res)=>{
    try {
        //log
        PerformTaskService.deleteTaskAction(req.params);
        res.status(200).json({
            success: true,
            messages: "Xoa thanh cong"
        })
    } catch (error) {
        //log
        res.status(400).json({
            success: false,
            messages : "Xoa k dc",
            content : error
        })
    }
}
// Lấy tất cả bình luận và hoạt động của một công việc
exports.getActionComments =async (req, res) => {
    try {
        var actionComments = await PerformTaskService.getActionComments(req.params)
        //Log
        res.status(200).json({
            success: true,
            messages : "success",
            content: actionComments
        })
    } catch (error) {
        //Log
        res.status(400).json({
            success: false,
            messages: "Loi",
            content : error
        })
    }
 }
 
 // Tạo một bình luận hoặc hoạt động cho công việc
 exports.createActionComment = async (req, res) => {
     try {
         var actionComment = await PerformTaskService.createActionComment(req.body);
         //log
         res.status(200).json({
             success: true,
             messages : "Tao comment action",
             content : actionComment
         })
     } catch (error) {
         //log
         res.status(400).json({
             success:false,
             messages: "Loi tao action comment",
             content: error
         })
     }
 }
// Chỉnh sửa một hoạt động hoặc bình luận
exports.editActionComment = async (req, res) => {
    try {
        var actionComment = await PerformTaskService.editActionComment(req.params,req.body)
        //log
        res.status(200).json({
            success: true,
            messages : "Edit thanh cong",
            content : actionComment
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: "Edit khong thanh cong",
            content : error
        })
    }
}

// Xóa bỏ một bình luận hoặc hoạt động
exports.deleteActionComment = (req, res) => {
    return PerformTaskService.deleteActionComment(req, res);
}

