const mongoose = require("mongoose");
const HistoryWorkingTime = require('../../../models/historyWokingTime.model');
const CommentTask = require('../../../models/commentTask.model');
const Task = require('../../../models/task.model');
const ActionTask = require('../../../models/actionTask.model');
const InformationTaskTemplate = require('../../../models/informationTaskTemplate.model');
const TaskFile = require('../../../models/taskFile.model');
const ResultInfoTask = require('../../../models/resultInformationTask.model');
const ResultTask = require('../../../models/resultTask.model');

// Bấm giờ công việc
// Lấy tất cả lịch sử bấm giờ theo công việc
exports.getLogTimer = (req, res) => {
    HistoryWorkingTime.find({ task: req.params.task }).populate("user")
        .then(logTimers => res.status(200).json(logTimers))
        .catch(err => res.status(400).json(err));
    console.log("Get all log timer");
}

// Lấy trạng thái bấm giờ hiện tại. Bảng HistoryWorkingTime tìm hàng có endTime là rỗng 
// Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
exports.getTimerStatus = (req, res) => {
    HistoryWorkingTime.findOne({ task: req.params.task, user: req.params.user, stopTimer: null })
        .then(timerStatus => res.status(200).json(timerStatus))
        .catch(err => res.status(400).json(err));
    console.log("Get Timer Status current");
}

// Bắt đầu bấm giờ: Lưu thời gian bắt đầu
exports.startTimer = async (req, res) => {
    try {
        var timer = await HistoryWorkingTime.create({
            task: req.body.task,
            user: req.body.user,
            start: req.body.startTimer,
            startTimer: req.body.startTimer,
            stopTimer: null,
            time: 0
        });
        res.json({
            message: "Bắt đầu tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Tạm dừng: Lưu thời gian đã bấm (time)
exports.pauseTimer = async (req, res) => {
    try {
        var timer = await HistoryWorkingTime.findByIdAndUpdate(
            req.params.id, { time: req.body.time, pause: true }, { new: true }
        );

        res.json({
            message: "Tạm dừng tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Tiếp tục bấm giờ: Cập nhật lại trạng thái bắt đầu (time)
exports.continueTimer = async (req, res) => {
    try {
        var timer = await HistoryWorkingTime.findByIdAndUpdate(
            req.params.id, { startTimer: req.body.startTimer, pause: false }, { new: true }
        );

        res.json({
            message: "Tạm dừng tính giờ",
            timerStatus: timer
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (enndTime và time)
exports.stopTimer = async (req, res) => {
    try {
        console.log(req.body);
        var timer = await HistoryWorkingTime.findByIdAndUpdate(
            req.params.id, { stopTimer: req.body.stopTimer, time: req.body.time }, { new: true }
        );
        var task = await Task.findByIdAndUpdate(
            req.body.task, { $inc: { 'time': req.body.time } }, { new: true }
        );
        task = await task.populate('responsible unit').execPopulate();
        if (task.tasktemplate !== null) {
            var actionTemplates = await ActionTask.find({ tasktemplate: task.tasktemplate._id });
            var informationTemplate = await InformationTaskTemplate.find({ tasktemplate: task.tasktemplate._id });
            res.status(200).json({
                "info": task,
                "actions": actionTemplates,
                "informations": informationTemplate
            })
        } else {
            res.status(200).json({ "info": task });
        }
    } catch (error) {
        res.json({ message: error });
    }
}

// Lấy tất cả bình luận của một công việc
exports.getCommentTask = (req, res) => {
    CommentTask.find({ task: req.params.task })
        .sort({ 'createdAt': 'asc' })
        .populate({ path: 'creator file' })
        .then(commentTasks => res.status(200).json(commentTasks))
        .catch(err => res.status(400).json(err));
}

// Thêm bình luận: Update nội dung bình luận và file đính kèm
exports.createCommentTask = async (req, res) => {
    try {
        var file = await TaskFile.create({
            name: req.file.filename,
            url: '/uploadfiles/'+req.file.filename
        })
        var comment = await CommentTask.create({
            task: req.body.task,
            creator: req.body.creator,
            parent: req.body.parent==="null"?null:req.body.parent,
            content: req.body.content,
            file: file._id
        });
        // var task = await Task.findByIdAndUpdate(
        //     req.body.task, {$push: {comments: comment._id}}, {new: true}
        // );
        comment = await comment.populate('creator file').execPopulate();
        res.json({
            message: "Thêm bình luận thành công",
            commentTask: comment
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Sửa bình luận: Sửa nội dung bình luận và file đính kèm
exports.editCommentTask = async (req, res) => {
    try {
        var comment = await CommentTask.findByIdAndUpdate(
            req.params.id, { content: req.body.content }, { new: true }
        );
        comment = await comment.populate('creator file').execPopulate();
        res.json({
            message: "Chỉnh sửa bình luận",
            commentTask: comment
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Xóa bình luận: Xóa nội dung bình luận và file đính kèm
exports.deleteCommentTask = async (req, res) => {
    try {
        var comment = await CommentTask.findByIdAndDelete(req.params.id); // xóa comment theo id
        res.status(200).json("Xóa bình luận thành công");
    } catch (error) {
        res.json({ message: error });
    }
}
// Test insert result info task
exports.createResultInfoTask = async (req, res) => {
    try {
        // Check nếu như là kiểu date thì ...
        var resultInfoTask1 = await ResultInfoTask.create({
            member: req.body.member,
            infotask: req.body.infotask,
            value: req.body.value
        });
        res.json({
            message: "Thêm bình luận thành công",
            resultInfoTask1: resultInfoTask1
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Thêm thông tin kết quả của các thông tin công việc theo mẫu
exports.createResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await ResultInfoTask.create({
                    member: item.user,
                    infotask: item.infotask,
                    value: item.value
                })
                return result._id;
            }))
            // Cập nhật thông tin công việc
            task = await Task.findByIdAndUpdate(
                req.body.task, { resultInfo: listResultInfoTask, point: req.body.systempoint }, { new: true }
            );
        }
        
        res.json({
            message: "Lưu thành công kết quả nhập liệu",
            task: task
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Sửa thông tin kết quả của các công việc không theo mẫu
exports.editResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await ResultInfoTask.findByIdAndUpdate(item._id,{
                    member: item.user,
                    infotask: item.infotask,
                    value: item.value
                })
                return result;
            }))
        }
        res.json({
            message: "Chỉnh sửa thành công kết quả nhập liệu",
            listResultInfoTask: listResultInfoTask
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Thêm thông tin kết quả của đánh giá từng nhân viên
exports.createResultTask = async (req, res) => {
    try {
        var listResultTask = req.body.listResultTask;
        if (listResultTask !== []) {
            // Lưu thông tin kết quả 
            var listResultTask = await Promise.all(listResultTask.map(async (item) => {
                var result = await ResultInfoTask.create({
                    member: item.user,
                    systempoint: item.systempoint,
                    mypoint: item.mypoint,
                    approverpoint: item.approverpoint
                })
                return result._id;
            }))
            // Cập nhật thông tin công việc
            task = await Task.findByIdAndUpdate(
                req.body.task, { results: listResultTask }, { new: true }
            );
        }
        
        res.json({
            message: "Lưu thành công kết quả đánh giá",
            task: task
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Sửa thông tin kết quả của nhân viên trong công việc
exports.editResultTask = async (req, res) => {
    try {
        var listResultTask = req.body.listResultTask;
        if (listResultTask !== []) {
            // Lưu thông tin kết quả 
            var listResultTask = await Promise.all(listResultTask.map(async (item) => {
                var result = await ResultTask.findByIdAndUpdate(item._id,{
                    member: item.user,
                    systempoint: item.systempoint,
                    mypoint: item.mypoint,
                    approverpoint: item.approverpoint
                })
                return result;
            }))
        }
        res.json({
            message: "Chỉnh sửa thành công kết quả đánh giá",
            listResultTask: listResultTask
        });
    } catch (error) {
        res.json({ message: error });
    }
}