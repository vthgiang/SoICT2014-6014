const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
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
    var timesheetLogs = await Task.findById(params.task).populate("timesheetLogs.creator")
    return timesheetLogs.timesheetLogs;
}

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getActiveTimesheetLog = async (params) => {
    var timerStatus = await Task.findOne(
        {"timesheetLogs": { $elemMatch: { "creator": mongoose.Types.ObjectId(params.user), "stoppedAt": null } } },
        {"timesheetLogs" : 1, '_id': 1, 'name': 1 }
    );
    if (timerStatus !== null) {
        timerStatus.timesheetLogs = timerStatus.timesheetLogs.find(element => !(element.stoppedAt));
        return timerStatus;
    } else {
        return null;
    }
}

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimesheetLog = async (body) => {
    var timerUpdate = {
        startedAt: body.startedAt,
        creator:body.creator
    }
    var timer = await Task.findByIdAndUpdate(body.task, 
        { $push: { timesheetLogs: timerUpdate } },
        { new: true, "fields": {"timesheetLogs" : 1, '_id': 1, 'name': 1 } }
    );
    timer.timesheetLogs = timer.timesheetLogs.find(element => !(element.stoppedAt));
    return timer;
}
/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (endTime và time)
 */
exports.stopTimesheetLog = async (body) => {
    var timer = await Task.findOneAndUpdate(
        { "_id": body.task, "timesheetLogs._id": body.timesheetLog },
        {
            $set: {
                "timesheetLogs.$.stoppedAt": body.stoppedAt,
                "timesheetLogs.$.duration": body.duration,
                "timesheetLogs.$.description": body.description,
            }
        },
        {new: true}
    ).populate({path: "timesheetLogs.creator", select: "name"});
    
    return timer.timesheetLogs;
}
/**
 * Thêm bình luận của hoạt động
 */
exports.createCommentOfTaskAction = async (body,files) => {
        var commenttasks = await Task.updateOne(
            { "taskActions._id": body.taskActionId },
            {
                "$push": {
                    "taskActions.$.comments":
                    {
                        creator: body.creator,
                        description: body.description,
                         files: files
                    }
                }
            }
        )
        var task = await Task.findOne({"taskActions._id": body.taskActionId}).populate([
            { path: "taskActions.creator", model: User,select: 'name email avatar' },
            { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
            { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar'}
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
                "taskActions.$.comments.$[elem].description": body.description,
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
    var task = await Task.findOne({"taskActions.comments._id": params.id}).populate([
        { path: "taskActions.creator", model: User,select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar '},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}
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
        { path: "taskActions.creator", model: User,select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar '},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar'}
        ]).select("taskActions");
    return task.taskActions ;    
}
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (body,files) => {
    var actionInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    // var actionTaskabc = await Task.findById(req.body.task)
    var taskAction1 = await Task.findByIdAndUpdate(body.task,
        { $push: { taskActions: actionInformation } }, { new: true }
    )
   
    var task = await Task.findOne({ _id: body.task }).populate([
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}])

    var user = await User.findOne({ _id : body.creator});
    var tasks = await Task.findOne({ _id : body.task});
   
    return { taskActions: task.taskActions, tasks: tasks, user: user} ;
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (id,body) => {
    var action = await Task.updateOne(
        { "taskActions._id": id },
        {
            $set: {
                "taskActions.$.description": body.description
            }
        }
    )
    var task = await Task.findOne({ "taskActions._id": id }).populate([
        { path: "taskActions.creator", model: User,select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}]) 
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
    { path: "taskActions.creator", model: User,select: 'name email avatar' },
    { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar'}])

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
exports.createTaskComment = async (body,files) => {
    var commentInformation = {
        creator: body.creator,
        description: body.description,
        files:files
    }
    var taskComment1 = await Task.findByIdAndUpdate(body.task,
        { $push: { taskComments: commentInformation } }, { new: true });
    var task = await Task.findOne({_id: body.task}).populate([
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar'}]) 
    
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
                "taskComments.$.description": body.description
            }
        }
    )

    var task = await Task.findOne({"taskComments._id": params.id}).populate([
        { path: "taskComments.creator", model: User,select: 'name email avatar ' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}])    
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
        { path: "taskComments.creator", model: User,select: 'name email avatar ' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar '},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}])  
    return task.taskComments;    
}        
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (body,files) => {
    var taskcomment = await Task.updateOne(
        {"taskComments._id": body.id},
        {
            "$push": {
                "taskComments.$.comments":
                {
                    creator: body.creator,  
                    description: body.description,
                    files: files
                }
            }
        }
    )

    
    var taskComment = await Task.findOne({"taskComments._id": body.id}).populate([
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}]) 
    .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Sửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (params,body) => {
    const now = new Date();
    var comment = await Task.updateOne(
        { "taskComments.comments._id": params.id },
        {
            $set:
            {
                "taskComments.$.comments.$[elem].description": body.description,
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
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}]) 
    .select("taskComments");
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
        { path: "taskComments.creator", model: User,select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}]) 
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (id,body) => {
    // đánh giá
    if(body.type === 0){
        var task1 = await Task.findOne({ "taskActions._id": id })
    let idAccountableEmployee = task1.accountableEmployees.find(elem => body.creator===elem);
    if (idAccountableEmployee) {
        var evaluationAction = await Task.updateOne(
            {"taskActions._id":id},
            {
                "$push": {
                    "taskActions.$.evaluations":
                    {
                        creator: body.creator,
                        rating: body.rating,
                    }
                },
            },
            {$new: true}
        )

        var evaluationActionRating = await Task.update(
            {"taskActions._id":id},
            {
                $set: {"taskActions.$.rating": body.rating}
            },
            {$new: true}
        )
    } else {
        var evaluationAction1 = await Task.update(
            {"taskActions._id":id},
            {
                "$push": {
                    "taskActions.$.evaluations":
                    {
                        creator: body.creator,
                        rating: body.rating,
                    }
                }
            },
            {$new: true}
        )
    }
    // đánh giá lại
    }else if(body.type === 1){
        let taskAction = await Task.update(
            {$and: [{"taskActions._id":id},{"taskActions.evaluations.creator":body.creator}]},
            {
                $set: {"taskActions.$[item].evaluations.$[elem].rating": body.rating}
            },
            { arrayFilters: [
                    {
                        "elem.creator": body.creator
                    },
                    {
                        "item._id": id
                    }
                ]
            }
        )
    }

    var task = await Task.findOne({ "taskActions._id": id }).populate([
        { path: "taskActions.creator", model: User,select: 'name email avatar avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}
    ]);
    
    return task.taskActions;
}
// /**
//  * Đánh giá lại hành động
//  */
// exports.evaluationActionAgain = async (id,body) => {
//     console.log(body)
//     console.log(id)
   
//     let task = await Task.findOne({ "taskActions._id": id }).populate([
//         { path: "taskActions.creator", model: User,select: 'name email avatar avatar ' },
//         { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
//         { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}
//     ]);
//     return task.taskActions;
// }
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (params) => {
    
    var evaluationActionRating = await Task.updateOne(
        {"taskActions._id":params.id},
        {
            $set: {
                "taskActions.$.creator": params.idUser,
                "taskActions.$.createdAt":Date.now()
            }
        }
    )  
    
    var task = await Task.findOne({ "taskActions._id": params.id }).populate([
        { path: "taskActions.creator", model: User,select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar'},
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar '}]) 
    return task.taskActions;   
}
/**
 * Upload tài liệu cho cộng việc
 */
exports.uploadFile = async (params,files) => {
    var evaluationActionRating = await Task.updateOne(
        {_id:params.task},
        {
            $push: {files:  files}
        }
    )  
    var task = await Task.findOne({ _id: params.task }).populate([
        { path: "files.creator", model: User, select: 'name email avatar' },
    ]);
    return task.files
}