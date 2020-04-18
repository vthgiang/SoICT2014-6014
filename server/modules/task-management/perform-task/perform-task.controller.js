const PerformTaskService = require('./perform-task.service');

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
exports.getCommentTask = (req, res) => {
    return PerformTaskService.getCommentTask(req, res);
}
//
exports.getActionTask = (req, res) => {
    return PerformTaskService.getActionTask(req, res);
}

// Tạo một bình luận hoặc hoạt động cho công việc
exports.createCommentTask = (req, res) => {
    return PerformTaskService.createCommentTask(req, res);
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

// Thêm kết quả đánh giá công việc cho từng người tham gia
exports.createResultTask = (req, res) => {
    return PerformTaskService.createResultTask(req, res);
}

// Chỉnh sửa kết quả đánh giá công việc cho từng người tham gia
exports.editResultTask = (req, res) => {
    return PerformTaskService.editResultTask(req, res);
}

// Chỉnh sửa một hoạt động hoặc bình luận
exports.editCommentTask = (req, res) => {
    return PerformTaskService.editCommentTask(req, res);
}

// Xóa bỏ một bình luận hoặc hoạt động
exports.deleteCommentTask = (req, res) => {
    return PerformTaskService.deleteCommentTask(req, res);
}
exports.createActionTask = (req,res) => {
    return PerformTaskService.createActionTask(req,res);
}
exports.editActionTask = (req,res) =>{
    return PerformTaskService.editActionTask(req,res);
}
exports.deleteActionTask = (req,res)=>{
    return PerformTaskService.deleteActionTask(req,res)
}