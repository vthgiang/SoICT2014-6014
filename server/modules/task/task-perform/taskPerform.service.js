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
exports.getTaskTimesheetLogs = async (params) => {
    var logTimers= await TimesheetLog.find({ task: params.task }).populate("user");

    return logTimers;
}

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getActiveTimesheetLog = async (params) => {
    var timerStatus =await TimesheetLog.findOne({ task: params.task, user: params.user, stopTimer: null })

    return timerStatus
}

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimesheetLog = async (body) => {
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
 * // TODO: Bỏ service này
 * Tạm dừng: Lưu thời gian đã bấm (time)
 */
exports.pauseTimesheetLog = async (params,body) => {
    var timer = await TimesheetLog.findByIdAndUpdate(
        params.id, { time: body.time, pause: true }, { new: true }
    );

    return timer;
}

/**
 * // TODO: Bỏ service này
 * Tiếp tục bấm giờ: Cập nhật lại trạng thái bắt đầu (time)
 */
exports.continueTimesheetLog = async (params,body) => {
    var timer = await TimesheetLog.findByIdAndUpdate(
        params.id, { startTimer: body.startTimer, pause: false }, { new: true }
    );

    return timer;
}

/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (enndTime và time)
 */
exports.stopTimesheetLog = async (req, res) => {
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
 * Lấy tất cả nội dung bình luận của hoạt động
 */
exports.getCommentsOfTaskAction = async (params) => {
    var actionComments = await Task.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.task) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"

            }
        },
        {$unwind : "$creator"}
    ])

    return actionComments;

}

/**
 * Thêm bình luận của hoạt động
 */
exports.createCommentOfTaskAction = async (body) => {

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
        var actionComment = await Task.aggregate([
            {
                $match: { "taskActions._id": mongoose.Types.ObjectId(body.taskActionId) }
            },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { "_id": mongoose.Types.ObjectId(body.taskActionId) } },
            { $unwind: "$comments" },
            { $sort: { "comments.createdAt": -1 } },
            {
                $group: {
                    _id: null,
                    first: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$first.comments" } },
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"

                }
            },
            {$unwind : "$creator"}
        ])
        return actionComment[0];
}
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editCommentOfTaskAction = async (params,body) => {
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
    var commentAction = await Task.aggregate([
        { $match: { "taskActions.comments._id": mongoose.Types.ObjectId(params.id) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.id) } },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        }
    ])
    return commentAction[0];
}

/**
 * Xóa bình luận hoạt động
 */
exports.deleteCommentOfTaskAction = async (params) => {
    var action = await Task.update(
        { "taskActions.comments._id": params.id },
        { $pull: { "taskActions.$.comments" : {_id : params.id} } },
        { safe: true })
}
/**
 * Lấy thông tin tất cả các hoạt động không theo mẫu của công việc
 */
exports.getTaskActions = async (taskId) => {
    //tim cac field actiontask trong task với ddkien task hiện tại trùng với task.params
    var taskaction = await Task.findOne({ _id: taskId }).populate('taskActions.creator').sort({'createdAt': 'asc'}).select("taskActions -_id");
    
    var taskactions = taskaction.taskActions
    return taskactions
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
        .populate(
            'taskActions.creator'
        )
    //aggregate trả về 1 mảng có 1 phần tử => taskAction[0]
    var taskAction = await Task.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(body.task) } },
        { $unwind: "$taskActions" },
        { $sort: { "taskActions.createdAt": -1 } },
        { $replaceRoot: { newRoot: "$taskActions" } },
        {
            $group: {
                _id: null,
                first: { $first: "$$ROOT" }
            }
        },
        { $replaceRoot: { newRoot: "$first" } },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" }
    ])

    return taskAction[0];
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
    var taskAction = await Task.aggregate([
        { $match: { "taskActions._id": mongoose.Types.ObjectId(params.id) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.id) } },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" }
    ])
    return taskAction[0];
}

/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (params) => {
    var action = await Task.update(
        { "taskActions._id": params.id },
        { $pull: { taskActions: { _id: params.id } } },
        { safe: true })
}
/**
 * Lấy tất cả các bình luận của công việc
 */
exports.getTaskComments
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
    
    var taskComment = await Task.aggregate([
        {$match : {_id : mongoose.Types.ObjectId(body.task)}},
        {$unwind: "$taskComments"},
        { $sort: { "taskComments.createdAt": -1 } },
        { $replaceRoot: { newRoot: "$taskComments" } },
        {
            $group: {
                _id: null,
                first: { $first: "$$ROOT" }
            }
        },
        { $replaceRoot: { newRoot: "$first" } },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" }
    ])    
    
    //aggregate tra ve mang 
    return taskComment[0]
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
exports.createTaskInformation = async (req, res) => {
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
exports.editTaskInformation = async (req, res) => {
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
exports.createTaskResult = async (result, taskID, evaluateID, date) => {
    var item = result;

    if (item !== null) {
        // Lưu thông tin kết quả 
         // Lưu thông tin kết quả 
         var resultTask = {
            employee: item.employee,
            role: item.role,
            automaticPoint: item.automaticPoint,
            employeePoint: item.employeePoint,
            approvedPoint: item.approvedPoint
        }
        // Cập nhật thông tin công việc
        var addResult = await Task.updateOne(
            {
                _id: taskID,
                "evaluations._id" : evaluateID
                // "evaluations.date": date // req.body.date // "2020-04-22T16:06:17.145Z"
            }, 
            {
                $push: {
                    "evaluations.$.results": resultTask
                } 
            }, 
            { new: true }
        );
    }
    
    return await Task.findById(taskID);
    
}

/**
 * Sửa thông tin kết quả của nhân viên trong công việc
 */
exports.editTaskResult = async (listResult,taskid) => {
    if (listResult !== []) {
        // Lưu thông tin kết quả 
        listResult.forEach( async (item) => {
            var newTask = await Task.updateOne(
                {
                    "evaluations.results._id" : item._id,
                    // k can xet dieu kien ngay danh gia vi _id cua result la duy nhat
                },
                { $set: {
                    "evaluations.$.results.$[elem].automaticPoint": item.automaticPoint,
                    "evaluations.$.results.$[elem].employeePoint": item.employeePoint,
                    "evaluations.$.results.$[elem].approvedPoint": item.approvedPoint
                }},
                { arrayFilters: [{
                        "elem._id" : item._id,
                    }]
                } 
            );
        })
    }
    return await Task.findOne({ _id: taskid });
}

