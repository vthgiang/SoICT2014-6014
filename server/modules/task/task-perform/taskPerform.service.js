const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
const TaskAction = require('../../../models/task/taskAction.model');
const TaskTemplateInformation = require('../../../models/task/taskResultInformation.model');
//const TaskFile = require('../../../models/taskFile.model');
const TaskResultInformation = require('../../../models/task/taskResultInformation.model');
const TaskResult = require('../../../models/task/taskResult.model');
const User = require('../../../models/auth/user.model')

/**
 * Bấm giờ công việc
 * Lấy tất cả lịch sử bấm giờ theo công việc
 */
exports.getLogTimer = async (params) => {
    var logTimers= await TimesheetLog.find({ task: params.task }).populate("user");

    return logTimers;
}

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getTimerStatus = async (params) => {
    var timerStatus =await TimesheetLog.findOne({ task: params.task, user: params.user, stopTimer: null })

    return timerStatus
}

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimer = async (body) => {
    var timer = await TimesheetLog.create({
        task: body.task,
        user: body.user,
        start: body.startTimer,
        startTimer: body.startTimer,
        stopTimer: null,
        time: 0
    });

    return timer;
}

/**
 * ạm dừng: Lưu thời gian đã bấm (time)
 */
exports.pauseTimer = async (params,body) => {
    var timer = await TimesheetLog.findByIdAndUpdate(
        params.id, { time: body.time, pause: true }, { new: true }
    );

    return timer;
}

/**
 * Tiếp tục bấm giờ: Cập nhật lại trạng thái bắt đầu (time)
 */
exports.continueTimer = async (params,body) => {
    var timer = await TimesheetLog.findByIdAndUpdate(
        params.id, { startTimer: body.startTimer, pause: false }, { new: true }
    );

    return timer;
}

/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (enndTime và time)
 */
exports.stopTimer = async (req, res) => {
    var timer = await TimesheetLog.findByIdAndUpdate(
        req.params.id, { stopTimer: req.body.stopTimer, time: req.body.time }, { new: true }
    );
    var task = await Task.findByIdAndUpdate(
        req.body.task, { $inc: { 'time': req.body.time } }, { new: true }
    );
    task = await task.populate('responsible unit').execPopulate();
    if (task.tasktemplate !== null) {
        var actionTemplates = await TaskAction.find({ tasktemplate: task.tasktemplate._id });
        var informationTemplate = await TaskTemplateInformation.find({ tasktemplate: task.tasktemplate._id });
        
        return {
            "info": task,
            "actions": actionTemplates,
            "informations": informationTemplate
        
        }
    } else {
        
        return { "info": task }
    
    }
}

/**
 * Thêm bình luận của hoạt động
 */
exports.createActionComment = async (body) => {

        var commenttasks = await Task.updateOne(
            { "taskActions._id": body.taskActionId },
            {
                "$push": {
                    "taskActions.$.comments":
                    {
                        parent: body.parent,
                        creator: body.creator,
                        content: body.content,
                        //  file: file._id
                    }
                }
            }
        )
        // var task = await Task.aggregate([
        //     {
        //         $match: { "taskActions._id": mongoose.Types.ObjectId(body.taskActionId) }
        //     },
        //     { $unwind: "$taskActions" },
        //     { $replaceRoot: { newRoot: "$taskActions" } },
        //     { $match: { "_id": mongoose.Types.ObjectId(body.taskActionId) } },
        //     { $unwind: "$comments" },
        //     { $sort: { "comments.createdAt": -1 } },
        //     {
        //         $group: {
        //             _id: null,
        //             first: { $first: "$$ROOT" }
        //         }
        //     },
        //     { $replaceRoot: { newRoot: "$first.comments" } },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "creator",
        //             foreignField: "_id",
        //             as: "creator"

        //         }
        //     },
        //     {$unwind : "$creator"}
        // ])
        var task = await Task.findOne({"taskActions._id": body.taskActionId}).populate([
            { path: "taskActions.creator", model: User,select: 'name email' },
            { path: "taskActions.comments.creator", model: User, select: 'name email'}
        ]).select("taskActions");
        return task.taskActions ;
}
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editActionComment = async (params,body) => {
    const now = new Date()
    var action = await Task.updateOne(
        { "taskActions.comments._id": params.id },
        {
            $set:
            {
                "taskActions.$[].comments.$[elem].content": body.content,
                "taskActions.$[].comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.id
                }
            ]
        }
    )
    // var commentAction = await Task.aggregate([
    //     { $match: { "taskActions.comments._id": mongoose.Types.ObjectId(params.id) } },
    //     { $unwind: "$taskActions" },
    //     { $replaceRoot: { newRoot: "$taskActions" } },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "creator",
    //             foreignField: "_id",
    //             as: "creator"
    //         }
    //     },
    // ])
    var task = await Task.findOne({"taskActions.comments._id": params.id}).populate([
        { path: "taskActions.creator", model: User,select: 'name email' },
        { path: "taskActions.comments.creator", model: User, select: 'name email'}
    ]).select("taskActions")
    return task.taskActions;
}

/**
 * Xóa bình luận hoạt động
 */
exports.deleteActionComment = async (params) => {
    var action = await Task.update(
        { "taskActions.comments._id": params.id },
        { $pull: { "taskActions.$.comments" : {_id : params.id} } },
        { safe: true })
    
    var task = await Task.findOne({_id: params.task}).populate([
        { path: "taskActions.creator", model: User,select: 'name email' },
        { path: "taskActions.comments.creator", model: User, select: 'name email'}
        ]).select("taskActions");

    return task.taskActions ;    
}
/**
 * Lấy thông tin tất cả các hoạt động không theo mẫu của công việc
 */
exports.getTaskActions = async (taskId) => {
    //tim cac field actiontask trong task với ddkien task hiện tại trùng với task.params
    var task = await Task.findOne({ _id: taskId }).populate([
        { path: "taskActions.creator", model: User,select: 'name email' },
        { path: "taskActions.comments.creator", model: User, select: 'name email'}])
    
    return task.taskActions
 };
 
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (body) => {
    var actionInformation = {
        creator: body.creator,
        content: body.content
    }
    // var actionTaskabc = await Task.findById(req.body.task)
    var taskAction1 = await Task.findByIdAndUpdate(body.task,
        { $push: { taskActions: actionInformation } }, { new: true }
    )
    //aggregate trả về 1 mảng có 1 phần tử => taskAction[0]
    // var taskAction = await Task.aggregate([
    //     { $match: { _id: mongoose.Types.ObjectId(body.task) } },
    //     { $unwind: "$taskActions" },
    //     { $sort: { "taskActions.createdAt": -1 } },
    //     { $replaceRoot: { newRoot: "$taskActions" } },
    //     {
    //         $group: {
    //             _id: null,
    //             first: { $first: "$$ROOT" }
    //         }
    //     },
    //     { $replaceRoot: { newRoot: "$first" } },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "creator",
    //             foreignField: "_id",
    //             as: "creator"
    //         }
    //     },
    //     { $unwind: "$creator" }
    // ])

    var task = await Task.findOne({ _id: body.task }).populate([
        { path: "taskActions.creator", model: User,select: 'name email' },
        { path: "taskActions.comments.creator", model: User, select: 'name email'}])

    return task.taskActions ;
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (params,body) => {
    var action = await Task.updateOne(
        { "taskActions._id": params.id },
        {
            $set: {
                "taskActions.$.content": body.content
            }
        }
    )
    
    var task = await Task.findOne({ "taskActions._id": params.id }).populate([
        { path: "taskActions.creator", model: User,select: 'name email' },
        { path: "taskActions.comments.creator", model: User, select: 'name email'}])

    return task.taskActions ;
    
}

/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (params) => {
    var action = await Task.update(
        { "taskActions._id": params.id },
        { $pull: { taskActions: { _id: params.id } } },
        { safe: true })
   
    var task = await Task.findOne({ _id: params.task }).populate([
    { path: "taskActions.creator", model: User,select: 'name email' },
    { path: "taskActions.comments.creator", model: User, select: 'name email'}])

    return task.taskActions ;
}
// Test insert result info task
exports.createResultInfoTask = async (req, res) => {
    try {
        // Check nếu như là kiểu date thì ...
        var resultInfoTask1 = await TaskResultInformation.create({
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

/**
 * Thêm thông tin kết quả của các thông tin công việc theo mẫu
 */
exports.createResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await TaskResultInformation.create({
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

/**
 * Sửa thông tin kết quả của các công việc không theo mẫu
 */
exports.editResultInformationTask = async (req, res) => {
    try {
        var listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            var listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                var result = await TaskResultInformation.findByIdAndUpdate(item._id, {
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

/**
 * Thêm thông tin kết quả của đánh giá từng nhân viên
 */
exports.createResultTask = async (result, taskID) => {
    var item = result;

    if (item !== null) {
        // Lưu thông tin kết quả 
        var resultTask = {
            employee: item.member,
            role: item.roleMember,
            automaticPoint: item.systempoint,
            employeePoint: item.mypoint,
            approvedPoint: item.approverpoint
        }
        // Cập nhật thông tin công việc
        var task = await Task.findByIdAndUpdate(
            taskID, { $push: { results: resultTask } }, { new: true }
            // là _id của task muốn đánh giá.
        );
    }
    return task;

}

/**
 * Sửa thông tin kết quả của nhân viên trong công việc
 */
exports.editResultTask = async (listResult, taskid) => {
    if (listResult !== []) {
        // Lưu thông tin kết quả  var listResultTask = await Promise.all
        listResult.forEach(async (item) => {
            // var newTask = await Task.findOneAndUpdate({results: {$elemMatch: {_id : item._id} }},
            var newTask = await Task.updateOne({ "results._id": item._id },
                // await Task.updateOne({results: {$elemMatch: {_id : item._id} }},
                {
                    $set: {
                        "results.$.automaticPoint": item.systempoint,
                        "results.$.employeePoint": item.mypoint,
                        "results.$.approvedPoint": item.approverpoint
                    }
                }
            );
        })
    }
    return await Task.findOne({ _id: taskid });
}
/**
 * Tạo bình luận công việc
 */
exports.createTaskComment = async (body) => {
    var commentInformation = {
        creator: body.creator,
        content: body.content
    }

    var taskComment1 = await Task.findByIdAndUpdate(body.task,
        { $push: { taskComments: commentInformation } }, { new: true });
    
    
}
