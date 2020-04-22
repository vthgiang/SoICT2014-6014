const PerformTaskService = require('./taskPerform.service');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module thực hiện công việc
// Lấy tất tả lịch sử bấm giờ của một công việc
exports.getLogTimer = (req, res) => {
    return PerformTaskService.getLogTimer(req, res);
}

// Lấy trạng thái bấm giờ hiện tai (chưa kết thúc)
exports.getTimerStatus = (req, res) => {
    return PerformTaskService.getTimerStatus(req, res);
}

// Bắt đầu bấm giờ
exports.startTimer = (req, res) => {
    return PerformTaskService.startTimer(req, res);
}

// Tạm dừng bấm giờ
exports.pauseTimer = (req, res) => {
    return PerformTaskService.pauseTimer(req, res);
}

// Tiếp tục bấm giờ
exports.continueTimer = (req, res) => {
    return PerformTaskService.continueTimer(req, res);
}

// Kết thúc bấm giờ
exports.stopTimer = (req, res) => {
    return PerformTaskService.stopTimer(req, res);
}

// Lấy tất cả bình luận và hoạt động của một công việc
exports.getActionComments = (req, res) => {
    return PerformTaskService.getActionComments(req, res);
}
//
exports.getTaskActions = (req, res) => {
    return PerformTaskService.getTaskActions(req, res);
}

// Tạo một bình luận hoặc hoạt động cho công việc
exports.createActionComment = (req, res) => {
    return PerformTaskService.createActionComment(req, res);
}

// Test thêm 1 kết quả nhập liệu cho thông tin mẫu công việc
exports.createResultInfoTask = (req, res) => {
    return PerformTaskService.createResultInfoTask(req, res);
}

// Thêm dữ liệu nhập liệu cho thông tin mẫu công việc
exports.createResultInformationTask = (req, res) => {
    return PerformTaskService.createResultInformationTask(req, res);
}

// Chỉnh sửa dữ liệu nhập liệu cho thông tin mẫu công việc
exports.editResultInformationTask = (req, res) => {
    return PerformTaskService.editResultInformationTask(req, res);
}

// Chỉnh sửa một hoạt động hoặc bình luận
exports.editActionComment = (req, res) => {
    return PerformTaskService.editActionComment(req, res);
}

// Xóa bỏ một bình luận hoặc hoạt động
exports.deleteActionComment = (req, res) => {
    return PerformTaskService.deleteActionComment(req, res);
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
exports.createTaskAction = (req,res) => {
    return PerformTaskService.createTaskAction(req,res);
}
exports.editTaskAction = (req,res) =>{
    return PerformTaskService.editTaskAction(req,res);
}
exports.deleteTaskAction = (req,res)=>{
    return PerformTaskService.deleteTaskAction(req,res)
}