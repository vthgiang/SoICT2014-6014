const mongoose = require("mongoose");
const HistoryWorkingTime = require('../../../models/task/timesheetLog.model');
const CommentTask = require('../../../models/task/taskComment.model');
const Task = require('../../../models/task/task.model');
const ActionTask = require('../../../models/task/taskAction.model');
const InformationTaskTemplate = require('../../../models/task/taskTemplateInformation.model');
const TaskFile = require('../../../models/task/taskFile.model');
const ResultInfoTask = require('../../../models/task/taskResultInformation.model');
const ResultTask = require('../../../models/task/taskResult.model');
const User = require('../../../models/auth/user.model')

// Bấm giờ công việc
// Lấy tất cả lịch sử bấm giờ theo công việc
exports.getLogTimer = (req, res) => {
    HistoryWorkingTime.find({ task: req.params.task }).populate("user")
        .then(logTimers => res.status(200).json(logTimers))
        .catch(err => res.status(400).json(err));
}

// Lấy trạng thái bấm giờ hiện tại. Bảng HistoryWorkingTime tìm hàng có endTime là rỗng 
// Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
exports.getTimerStatus = (req, res) => {
    HistoryWorkingTime.findOne({ task: req.params.task, user: req.params.user, stopTimer: null })
        .then(timerStatus => res.status(200).json(timerStatus))
        .catch(err => res.status(400).json(err));
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
        .populate({ path: 'creator' })
        .then(commentTasks => res.status(200).json(commentTasks))
        .catch(err => res.status(400).json(err));
}
exports.getActionTask =async (req,res)=>{
    try {
        //tim cac field actiontask trong task với ddkien task hiện tại trùng với task.params
        var actionTasks = await Task.findOne({_id:req.params.task},{actionTask:1,_id:0}).populate('actionTask.creator')
        var actionTask = actionTasks.actionTask
        // .sort({'createdAt': 'asc'});
        res.status(200).json({
            message: 'Get all action task success',
            actionTask: actionTask
        })
    } catch (error) {
        res.status(400).json(error)
    }
};
// Thêm bình luận: Update nội dung bình luận và file đính kèm
exports.createCommentTask = async (req, res) => {
    try {
        // var file = await TaskFile.create({
        //     name: req.file.filename,
        //     url: '/uploadfiles/'+req.file.filename
        // })
        var commenttasks = await CommentTask.create({
            task: req.body.task,
            creator: req.body.creator,
            parent: req.body.parent==="null"?null:req.body.parent,
            content: req.body.content,
            //  file: file._id
        }); 
        // var task = await Task.findByIdAndUpdate(
        //     req.body.task, {$push: {commenttasks: commenttasks._id}}, {new: true}
        // );

        // commenttasks = await CommentTask.populate('creator')
        
        res.status(200).json({
            message: "Thêm bình luận thành công",
            commentTask: commenttasks
        });
    }catch (error) {
        res.status(400).json({ message: "Hello" });
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
//Sửa nội dung hoạt động của công việc không theo mẫu
exports.editActionTask = async (req,res) =>{
    try {
        
        var action = await Task.updateOne(
            {"actionTask._id" : req.params.id},
            {$set:{
                "actionTask.$.name": req.body.content
            }}
            )
        var actionTask = await Task.findOne(
            {"actionTask._id": req.params.id}, 
            {_id: 0, actionTask: {$elemMatch: {name:req.body.content}}}).populate("actionTask.creator");
        res.status(200).json({
            success: true,
            message:'Edit thành công',
            content : actionTask.actionTask[0]
        })    
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
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
exports.deleteActionTask = async (req,res) => {
    try {
        var action = await Task.update(
            { "actionTask._id": req.params.id },
            { $pull: { actionTask : { _id : req.params.id } } },
            { safe: true },)
        res.status(200).json({
            success: true,
            message:' Xóa hoạt động thành công'
        })        
    } catch (error) {
        res.status(400).json({
            message:'Lỗi rồi'
        })
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
exports.createResultTask = async (result, taskID) => {
    var item = result;
    
    if (item !== null) {
        // Lưu thông tin kết quả 
        var resultTask = {
            member: item.member,
            roleMember: item.roleMember,
            systempoint: item.systempoint,
            mypoint: item.mypoint,
            approverpoint: item.approverpoint
        }
        // Cập nhật thông tin công việc
        var task = await Task.findByIdAndUpdate(
            taskID, { $push: { results: resultTask } }, { new: true }
            // là _id của task muốn đánh giá.
        );
    }
    return task;
    
}


// Sửa thông tin kết quả của nhân viên trong công việc
exports.editResultTask = async (listResult,taskid) => {
    if (listResult !== []) {
        // Lưu thông tin kết quả  var listResultTask = await Promise.all
        listResult.forEach( async (item) => {
            // var newTask = await Task.findOneAndUpdate({results: {$elemMatch: {_id : item._id} }},
            var newTask = await Task.updateOne({"results._id" : item._id},
            // await Task.updateOne({results: {$elemMatch: {_id : item._id} }},
                { $set: {
                    "results.$.systempoint": item.systempoint,
                    "results.$.mypoint": item.mypoint,
                    "results.$.approverpoint": item.approverpoint
                }}
            );
        })
    }
    return await Task.findOne({_id: taskid});
}
exports.createActionTask = async (req,res) => {
    try {
        var actionInformation = {
            creator : req.body.creator,
            name : req.body.name
        }
        // var actionTaskabc = await Task.findById(req.body.task)
        var actionTask = await Task.findByIdAndUpdate(req.body.task,
                {$push: {actionTask:actionInformation}},{new: true}
        )
        .populate(
           'actionTask.creator'
        )
        var test =actionTask.actionTask
        res.status(200).json({
            message: "Thêm hoạt động thành công",
            actionTask: test
        });
    } catch (error) {
        res.status(400).json({ message: "Lỗi thêm hoạt động" });
    }
}