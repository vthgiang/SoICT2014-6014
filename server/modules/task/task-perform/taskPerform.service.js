const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
const TaskAction = require('../../../models/task/taskAction.model');
const TaskTemplateInformation = require('../../../models/task/taskResultInformation.model');
//const TaskFile = require('../../../models/taskFile.model');
const TaskResultInformation = require('../../../models/task/taskResultInformation.model');
const TaskResult = require('../../../models/task/taskResult.model');
const User = require('../../../models/auth/user.model');
const { evaluationAction } = require("./taskPerform.controller");

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
exports.getTimerStatus = async (params) => {
    var timerStatus =await TimesheetLog.findOne({ task: params.task, user: params.user, stopTimer: null })

    return timerStatus
}

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimesheetLog = async (body) => {

    console.log(body)
    var timerUpdate = {
        user: body.user,
        startedAt: body.startedAt,
        description: body.description
    }
    var timer = await Task.findByIdAndUpdate(body.task,
        { $push: { timesheetLogs: timerUpdate } }, { new: true })
        console.log("Chạy đến service")
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
exports.createCommentOfTaskAction = async (body) => {
        var commenttasks = await Task.updateOne(
            { "taskActions._id": body.taskActionId },
            {
                "$push": {
                    "taskActions.$.comments":
                    {
                        creator: body.creator,
                        content: body.content,
                        //  file: file._id
                    }
                }
            }
        )
        var task = await Task.findOne({"taskActions._id": body.taskActionId}).populate([
            { path: "taskActions.creator", model: User,select: 'name email' },
            { path: "taskActions.comments.creator", model: User, select: 'name email'}
        ]).select("taskActions");
        return task.taskActions ;
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
                "taskActions.$.comments.$[elem].content": body.content,
                "taskActions.$.comments.$[elem].updatedAt": now
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
exports.deleteCommentOfTaskAction = async (params) => {
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
        { path: "taskActions.creator", model: User,select: 'name email'},
        { path: "taskActions.comments.creator", model: User, select: 'name email'}])
    
    return task.taskActions
 };
 
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (body) => {
    var actionInformation = {
        creator: body.creator,
        description: body.content
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
exports.editTaskAction = async (id,body) => {
    var action = await Task.updateOne(
        { "taskActions._id": id },
        {
            $set: {
                "taskActions.$.description": body.content
            }
        }
    )
    var task = await Task.findOne({ "taskActions._id": id }).populate([
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
exports.createTaskResult = async (result, taskID, evaluateID, date) => {
    var item = result;

    if (item !== null) {
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
    var task = await Task.findOne({_id: body.task}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}])   
    
     return task.taskComments;
}
/**
 * Lấy tất cả bình luận công việc
*/
exports.getTaskComments = async (params) => {
    var task = await Task.findOne({_id:params.task}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}])    
    return task.taskComments;
}
/**
 * Sửa bình luận công việc
 */
exports.editTaskComment = async (params,body) => {
    var taskComment = await Task.updateOne(
        { "taskComments._id": params.id },
        {
            $set: {
                "taskComments.$.content": body.content
            }
        }
    )

    var task = await Task.findOne({"taskComments._id": params.id}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}])    
    return task.taskComments;
}
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (params) => {
    var action = await Task.update(
        { "taskComments._id": params.id },
        { $pull: { taskComments: { _id: params.id } } },
        { safe: true })

    var task = await Task.findOne({_id: params.task}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}])    
    return task.taskComments;    
}        
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (body) => {
    var taskcomment = await Task.updateOne(
        {"taskComments._id": body.id},
        {
            "$push": {
                "taskComments.$.comments":
                {
                    creator: body.creator,  
                    content: body.content,
                    //  file: file._id
                }
            }
        }
    )

    
    var taskComment = await Task.findOne({"taskComments._id": body.id}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}
    ]).select("taskComments");

    return taskComment.taskComments;
}
/**
 * Sửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (params,body) => {
    console.log(params)
    console.log(body)
    const now = new Date();
    var comment = await Task.updateOne(
        { "taskComments.comments._id": params.id },
        {
            $set:
            {
                "taskComments.$.comments.$[elem].content": body.content,
                "taskComments.$.comments.$[elem].updatedAt": now
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
    
    var taskComment = await Task.findOne({"taskComments.comments._id": body.id}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}
    ]).select("taskComments");
    return taskComment.taskComments;
}
/**
 * Xóa bình luận của bình luận coogn việc
 */
exports.deleteCommentOfTaskComment = async (params) => {
    var comment = await Task.update(
        { "taskComments.comments._id": params.id },
        { $pull: { "taskComments.$.comments" : {_id : params.id} } },
        { safe: true })

     var taskComment = await Task.findOne({_id: params.task}).populate([
        { path: "taskComments.creator", model: User,select: 'name email' },
        { path: "taskComments.comments.creator", model: User, select: 'name email'}
        ]).select("taskComments");

    return taskComment.taskComments;
}
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (id,body) => {
    var task1 = await Task.findOne({ "taskActions._id": id })
    if(body.creator === task1.accountableEmployees){
    var evaluationAction = await Task.update(
        {"taskActions._id":id},
        {
            "$push": [{
                "taskActions.$.evaluations":
                {
                    creator: body.creator,
                    rating: body.rating,
                }
            },
            {
                "rating" : body.rating
            }]
        })
    }else {
        var evaluationAction = await Task.update(
            {"taskActions._id":id},
            {
                "$push": {
                    "taskActions.$.evaluations":
                    {
                        creator: body.creator,
                        rating: body.rating,
                    }
                }
            })
    }
    var task = await Task.findOne({ "taskActions._id": id }).populate([
        { path: "taskActions.creator", model: User,select: 'name email -id' },
        ,
        { path: "taskActions.evaluations.creator", model: User, select: 'name email -_id'}])

    return task.taskActions ;
}


/**
 * 2 th hien rating
 *  th1: nguoi chua thuc hien danh gia => elem.creator khong co trong mang
 * th2: mang evaluation rong
 * 
 */