const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
const TaskTemplateInformation = require('../../../models/task/taskResultInformation.model');
//const TaskFile = require('../../../models/taskFile.model');
const TaskResultInformation = require('../../../models/task/taskResultInformation.model');
const TaskResult = require('../../../models/task/taskResult.model');
const User = require('../../../models/auth/user.model');
const { evaluationAction } = require("./taskPerform.controller");
const fs = require('fs');
const moment = require("moment");

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
        { "timesheetLogs": { $elemMatch: { "creator": mongoose.Types.ObjectId(params.user), "stoppedAt": null } } },
        { "timesheetLogs": 1, '_id': 1, 'name': 1 }
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
        creator: body.creator
    }
    var timer = await Task.findByIdAndUpdate(body.task,
        { $push: { timesheetLogs: timerUpdate } },
        { new: true, "fields": { "timesheetLogs": 1, '_id': 1, 'name': 1 } }
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
            $set:
            {
                "timesheetLogs.$.stoppedAt": body.stoppedAt,
                "timesheetLogs.$.duration": body.duration,
                "timesheetLogs.$.description": body.description,
            }
        },
        { new: true }

    ).populate({ path: "timesheetLogs.creator", select: "name" });
    let time = 0;

    timer.timesheetLogs.length > 0 && timer.timesheetLogs.forEach(x => {
        time += x.duration;
    })
    var timer1 = await Task.findOneAndUpdate(
        { "_id": body.task, "timesheetLogs._id": body.timesheetLog },
        {
            $set:
            {
                totalLoggedTime: time
            }
        }
    )

    return timer.timesheetLogs;
}
/**
 * Thêm bình luận của hoạt động
 */
exports.createCommentOfTaskAction = async (params, body, files) => {

    var commenttasks = await Task.updateOne(
        { "taskActions._id": params.actionId },
        {
            "$push":
            {
                "taskActions.$.comments":
                {
                    creator: body.creator,
                    description: body.description,
                    files: files
                }
            }
        }
    )
    var task = await Task.findOne({ "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }
    ]).select("taskActions");
    return task.taskActions;
}
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editCommentOfTaskAction = async (params, body, files) => {
    console.log(params)
    const now = new Date()
    let action = await Task.updateOne(
        { "taskActions.comments._id": params.commentId },
        {
            $set:
            {
                "taskActions.$.comments.$[elem].description": body.description,
                "taskActions.$.comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let action1 = await Task.updateOne(
        { "taskActions.comments._id": params.commentId },
        {
            $push:
            {
                "taskActions.$.comments.$[elem].files": files
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let task = await Task.findOne({ "taskActions.comments._id": params.commentId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }
    ]).select("taskActions")
    return task.taskActions;
}

/**
 * Xóa bình luận hoạt động
 */
exports.deleteCommentOfTaskAction = async (params) => {
    let files = await Task.aggregate([
        { $match: { "taskActions.comments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "comments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])

    var action = await Task.update(
        { "taskActions.comments._id": params.commentId },
        { $pull: { "taskActions.$.comments": { _id: params.commentId } } },
        { safe: true })
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    var task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }
    ]).select("taskActions");
    return task.taskActions;
}
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (params, body, files) => {
    var actionInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    var taskAction1 = await Task.findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskActions: actionInformation
            }
        },
        { new: true }
    )

    var task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])

    var user = await User.findOne({ _id: body.creator });
    var tasks = await Task.findOne({ _id: params.taskId });
    var userEmail = await User.find({ _id: { $in: tasks.accountableEmployees } });
    var email = userEmail.map(item => item.email);

    return { taskActions: task.taskActions, tasks: tasks, user: user, email: email };
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (params, body, files) => {
    var action = await Task.updateOne(
        { "taskActions._id": params.actionId },
        {
            $set:
            {
                "taskActions.$.description": body.description
            }
        }
    )
    let action1 = await Task.updateOne(
        { "taskActions._id": params.actionId },
        {
            $push:
            {
                "taskActions.$.files": files
            }
        }
    )
    var task = await Task.findOne({ "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskActions;
}


/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (params) => {
    let files = await Task.aggregate([
        { $match: { "taskActions._id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])


    let action = await Task.update(
        { "taskActions._id": params.actionId },
        {
            $pull:
            {
                taskActions: { _id: params.actionId }
            }
        },
        { safe: true }
    )
    //xoa file sau khi xoa hoat dong
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }])

    return task.taskActions;
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
                req.body.task,
                { resultInfo: listResultInfoTask, point: req.body.systempoint },
                { new: true }
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
                "evaluations._id": evaluateID
                // "evaluations.date": date // req.body.date // "2020-04-22T16:06:17.145Z"
            },
            {
                $push:
                {
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
exports.editTaskResult = async (listResult, taskid) => {
    if (listResult !== []) {
        // Lưu thông tin kết quả 
        listResult.forEach(async (item) => {
            var newTask = await Task.updateOne(
                {
                    "evaluations.results._id": item._id,
                    // k can xet dieu kien ngay danh gia vi _id cua result la duy nhat
                },
                {
                    $set:
                    {
                        "evaluations.$.results.$[elem].automaticPoint": item.automaticPoint,
                        "evaluations.$.results.$[elem].employeePoint": item.employeePoint,
                        "evaluations.$.results.$[elem].approvedPoint": item.approvedPoint
                    }
                },
                {
                    arrayFilters:
                        [
                            { "elem._id": item._id }
                        ]
                }
            );
        })
    }
    return await Task.findOne({ _id: taskid });
}

/**
 * Tạo bình luận công việc
 */
exports.createTaskComment = async (params, body, files) => {
    var commentInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    var taskComment1 = await Task.findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskComments: commentInformation
            }
        },
        { new: true }
    );
    var task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }])

    return task.taskComments;
}
/**
 * Sửa bình luận công việc
 */
exports.editTaskComment = async (params, body, files) => {
    var taskComment = await Task.updateOne(
        { "taskComments._id": params.commentId },
        {
            $set:
            {
                "taskComments.$.description": body.description,

            }
        }
    )
    let taskcomment2 = await Task.updateOne(
        { "taskComments._id": params.commentId },
        {
            $push:
            {
                "taskComments.$.files": files
            }
        }
    )

    var task = await Task.findOne({ "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskComments;
}
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (params) => {
    let files = await Task.aggregate([
        { $match: { "taskComments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])
    //xoa files
    let i
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    var action = await Task.update(
        { "taskComments._id": params.commentId },
        { $pull: { taskComments: { _id: params.commentId } } },
        { safe: true })
    var task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskComments;
}
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (params, body, files) => {
    var taskcomment = await Task.updateOne(
        { "taskComments._id": params.commentId },
        {
            "$push":
            {
                "taskComments.$.comments":
                {
                    creator: body.creator,
                    description: body.description,
                    files: files
                }
            }
        }
    )


    var taskComment = await Task.findOne({ "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Sửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (params, body, files) => {
    const now = new Date();
    let comment = await Task.updateOne(
        { "taskComments.comments._id": params.commentId },
        {
            $set:
            {
                "taskComments.$.comments.$[elem].description": body.description,
                "taskComments.$.comments.$[elem].updatedAt": now
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )
    let action1 = await Task.updateOne(
        { "taskComments.comments._id": params.commentId },
        {
            $push:
            {
                "taskComments.$.comments.$[elem].files": files
            }
        },
        {
            arrayFilters:
                [
                    {
                        "elem._id": params.commentId
                    }
                ]
        }
    )

    var taskComment = await Task.findOne({ "taskComments.comments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
        .select("taskComments");
    return taskComment.taskComments;
}
/**
 * Xóa bình luận của bình luận coogn việc
 */
exports.deleteCommentOfTaskComment = async (params) => {
    let files = await Task.aggregate([
        { $match: { "taskComments.comments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "comments._id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])
    let comment = await Task.update(
        { "taskComments.comments._id": params.commentId },
        {
            $pull:
            {
                "taskComments.$.comments": { _id: params.commentId }
            }
        },
        { safe: true })

    //xoa file sau khi xoa binh luan    
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let taskComment = await Task.findOne({ _id: params.task }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (id, body) => {
    // đánh giá
    if (body.firstTime === 1) {
        //cập nhật điểm người đánh giá
        let evaluationAction = await Task.updateOne(
            { "taskActions._id": id },
            {
                $push:
                {
                    "taskActions.$.evaluations":
                    {
                        creator: body.creator,
                        rating: body.rating,
                    }
                },
            },
            { $new: true }
        )



        //danh sách người phê duyệt
        let task1 = await Task.findOne({ "taskActions._id": id })
        let accountableEmployees = task1.accountableEmployees



        //danh sách các đánh giá
        let evaluations = await Task.aggregate([
            { $match: { "taskActions._id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            { $unwind: "$evaluations" },
            { $replaceRoot: { newRoot: "$evaluations" } }
        ])


        //tim xem trong danh sách đánh giá ai là người phê duyệt
        let rating = [];
        evaluations.forEach(x => {
            if (accountableEmployees.some(elem => x.creator.toString() === elem.toString())) {
                rating.push(x.rating)
            }
        })


        //tính điểm trung bình
        let accountableRating = rating.reduce((accumulator, currentValue) => { return accumulator + currentValue }, 0) / rating.length


        //check xem th đấnh giá có là người phê duyệt không
        let idAccountableEmployee = task1.accountableEmployees.some(elem => body.creator === elem.toString())
        if (idAccountableEmployee) {
            let evaluationActionRating = await Task.updateOne(
                { "taskActions._id": id },
                {
                    $set:
                    {
                        "taskActions.$.rating": accountableRating
                    }
                },
                { $new: true }
            )
        }

        // đánh giá lại
    } else if (body.firstTime === 0) {
        let taskAction = await Task.update(
            { $and: [{ "taskActions._id": id }, { "taskActions.evaluations.creator": body.creator }] },
            {
                $set:
                {
                    "taskActions.$[item].evaluations.$[elem].rating": body.rating
                }
            },
            {
                arrayFilters:
                    [
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
        { path: "taskActions.creator", model: User, select: 'name email avatar avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }
    ]);

    return task.taskActions;
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (query) => {

    var evaluationActionRating = await Task.updateOne(
        { "taskActions._id": query.actionId },
        {
            $set: {
                "taskActions.$.creator": query.idUser,
                "taskActions.$.createdAt": Date.now()
            }
        }
    )

    let task = await Task.findOne({ "taskActions._id": query.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskActions;
}
/**
 * Upload tài liệu cho cộng việc
 */
exports.uploadFile = async (params, body, files) => {
    let evaluationActionRating = await Task.findOne(
        { _id: params.taskId }
    )


    let abc = [...evaluationActionRating.files, ...files]


    let abc1 = await Task.updateOne(
        { _id: params.taskId },
        { $set: { files: abc } }
    )

    let task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "files.creator", model: User, select: 'name email avatar' },
    ]);

    return task.files
}

/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (data) => {
    var { taskId, creator, title, description, createdAt } = data;

    var log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: description,
    }

    var task = await Task.findByIdAndUpdate(
        taskId, { $push: { logs: log } }, { new: true }
    ).populate("logs.creator");
    var taskLog = task.logs.reverse();

    return taskLog;
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (params) => {
    var task = await Task.findById(params.taskId).populate("logs.creator")

    return task.logs.reverse();
}

/**
 * hàm convert dateISO sang string
 */
formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;


    return [day, month, year].join('-');
}

/**
 * hàm check điều kiện evaluate tồn tại
 */
async function checkEvaluations(date, taskId, storeDate) {
    var evaluateId;

    var splitterStoreDate = storeDate.split("-");
    var storeDateISO = new Date(splitterStoreDate[2], splitterStoreDate[1] - 1, splitterStoreDate[0]);

    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var testCase;

    // kiểm tra evaluations
    var initTask = await Task.findById(taskId);

    var cloneTaskInfo = [];
    for (let i in initTask.taskInformations) {
        cloneTaskInfo[i] = {
            _id: initTask.taskInformations[i]._id,
            name: initTask.taskInformations[i].name,
            code: initTask.taskInformations[i].code,
            type: initTask.taskInformations[i].type,
            extra: initTask.taskInformations[i].extra,
            filledByAccountableEmployeesOnly: initTask.taskInformations[i].filledByAccountableEmployeesOnly
        }
    }

    // kiểm tra điều kiện của evaluations
    if (initTask.evaluations.length === 0) {
        testCase = "TH1";
    }
    else {
        var chk = initTask.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()));
        if (!chk) { // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else { // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }

    // TH1: chưa có evaluations => tạo mới
    if (testCase === "TH1") {

        var evaluationsVer1 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        }
        var taskV1 = await Task.updateOne({ _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer1
                }
            },
            {
                $new: true
            }
        );
        var taskV1 = await Task.findById(taskId);
        evaluateId = taskV1.evaluations[0]._id;

    }

    // TH2: Có evaluation nhưng chưa có tháng giống với date => tạo mới
    else if (testCase === "TH2") {

        var evaluationsVer2 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        }
        await Task.updateOne({ _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer2
                }
            },
            {
                $new: true
            }
        );

        var taskV2 = await Task.findById(taskId);
        evaluateId = taskV2.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;
    }

    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    else if (testCase === "TH3") {

        var taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;

    }

    return evaluateId;
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByResponsibleEmployees = async (data, taskId) => {
    var description = data.description;
    var name = data.name;
    var kpi = data.kpi;
    var user = data.user;
    var progress = data.progress;
    var info = data.info;
    var kpisItem = {
        employee: user,
        kpis: kpi
    };
    var date = data.date;
    var evaluateId;

    const endOfMonth = moment().endOf("month").format('DD-MM-YYYY')


    evaluateId = await checkEvaluations(date, taskId, endOfMonth);
    let task = await Task.findById(taskId);
    // cập nhật thông tin kpi
    var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis
    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    if (check_kpi === undefined) {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.kpis": kpisItem
                }
            },
            { $new: true }
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.kpis.$[elem].kpis": kpi
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user
                    }
                ]
            }
        );
    }
    // }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                var splitter = info[i].value.split("-");
                var infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    await Task.updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress
            }
        },
        { $new: true }
    );

    // var task = await Task.findById(taskId);
    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }

                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    },
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }

    // var newTask = await this.getTask(taskId).info;
    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.kpis.employee", select: "name email _id" },
        { path: "evaluations.kpis.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
    ]);

    //xu ly gui email
    var tasks = await Task.findById(taskId);
    var userId = tasks.accountableEmployees;
    var user = await User.find({ _id: { $in: userId } });
    var email = user.map(item => item.email);
    user = await User.findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    var description = data.description;
    var name = data.name;
    var priority = data.priority;
    var status = data.status;

    var startDate = data.startDate;
    var endDate = data.endDate;

    // var user = data.user;
    var progress = data.progress;
    var info = data.info;
    // var evaluateId = data.evaluateId;
    var accountableEmployees = data.accountableEmployees;
    var consultedEmployees = data.consultedEmployees;
    var responsibleEmployees = data.responsibleEmployees;
    var informedEmployees = data.informedEmployees;
    var inactiveEmployees = data.inactiveEmployees;

    // var date = Date.now();
    var date = data.date;

    // Chuẩn hóa ngày bắt đầu và ngày kết thúc
    var splitStartDate = startDate.split("-");
    var startOfTask = new Date(splitStartDate[2], splitStartDate[1] - 1, splitStartDate[0]);

    var splitEndDate = endDate.split("-");
    var endOfTask = new Date(splitEndDate[2], splitEndDate[1] - 1, splitEndDate[0]);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                var splitter = info[i].value.split("-");
                var infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    // cập nhật thông tin cơ bản
    await Task.updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress,
                priority: parseInt(priority[0]),
                status: status[0],

                startDate: startOfTask,
                endDate: endOfTask,

                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees,
                accountableEmployees: accountableEmployees,
                informedEmployees: informedEmployees,

                inactiveEmployees: inactiveEmployees

            }
        },
        { $new: true }
    );
    var task = await Task.findById(taskId);


    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly: task.taskInformations[i].filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value
                }
                await Task.updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id
                    },
                    {
                        $set: {
                            "taskInformations.$.value": task.taskInformations[i].value
                        }
                    },
                    {
                        $new: true
                    }
                )
            }
        }
    }



    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: " responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.kpis.employee", select: "name email _id" },
        { path: "evaluations.kpis.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
    ]);

    //xu ly gui email
    var tasks = await Task.findById(taskId);
    var userId = tasks.responsibleEmployees;
    var user = await User.find({ _id: { $in: userId } });
    var email = user.map(item => item.email);
    user = await User.findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };

}

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
    var automaticPoint = data.automaticPoint;
    var employeePoint = data.employeePoint;
    var role = data.role;
    var date = data.date;
    var evaluateId = await checkEvaluations(date, taskId, date);

    var resultItem = {
        employee: user,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }
    var task = await Task.findById(taskId);

    // cập nhật thông tin result

    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results


    var check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "Consulted"));
    if (check_results === undefined) {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            { $new: true }
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }
    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: " responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.kpis.employee", select: "name email _id" },
        { path: "evaluations.kpis.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
    var progress = data.progress;
    var automaticPoint = data.automaticPoint;
    var employeePoint = data.employeePoint;

    var role = data.role;

    var date = data.date;
    var kpi = data.kpi;
    var info = data.info;

    var splitter = date.split("-");
    var evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    var dateFormat = evaluateDate;

    var kpisItem = {
        employee: user,
        kpis: kpi
    }

    var resultItem = {
        employee: user,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    var evaluateId = await checkEvaluations(date, taskId, date);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined || info[i].value !== null
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                var splitter = info[i].value.split("-");
                var infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    await Task.updateOne({ _id: taskId }, { $set: { progress: progress } }, { $new: true });

    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            }
        },
        {
            $new: true,
        }
    );

    var task = await Task.findById(taskId);

    var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis

    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    if (check_kpi === undefined) {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.kpis": kpisItem
                }
            },
            { $new: true }
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.kpis.$[elem].kpis": kpi
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user
                    }
                ]
            }
        );
    }

    // cập nhật thông tin result

    // var listResult = task.evaluations[task.evaluations.length-1].results;
    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    var check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "Responsible"));
    if (check_results === undefined) {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": resultItem
                }
            },
            { $new: true }
        );
    } else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,

            },
            {
                $set: {
                    "evaluations.$.results.$[elem].employeePoint": employeePoint,
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role
                    }
                ]
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    // update Info task
    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var now = new Date();

    var cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }

                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {
                    await Task.updateOne(
                        {
                            _id: taskId,
                            "taskInformations._id": cloneInfo[i]._id
                        },
                        {
                            $set: {
                                "taskInformations.$.value": cloneInfo[i].value
                            }
                        },
                        {
                            $new: true
                        }
                    )
                }

                await Task.updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }

                )
            }
        }
    }

    // update date of evaluation

    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
            }
        },
        {
            $new: true
        }
    )

    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: " responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.kpis.employee", select: "name email _id" },
        { path: "evaluations.kpis.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (data, taskId) => {
    var user = data.user;
    // var evaluateId = data.evaluateId;
    var progress = data.progress;

    var automaticPoint = data.automaticPoint === undefined ? 0 : data.automaticPoint;
    var role = data.role;

    var date = data.date;
    var status = data.status; // neu ket thuc thi moi thay doi, con neu la danh gia thi k doi
    var info = data.info;
    var results = data.results;

    var splitter = date.split("-");
    var evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    var dateFormat = evaluateDate;

    var evaluateId = await checkEvaluations(date, taskId, date);

    // lấy info có value khác undefined
    var filterInfo = [];
    for (let i in info) {
        if (info[i].value !== undefined) {
            filterInfo.push(info[i]);
        }
    }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                var splitter = info[i].value.split("-");
                var infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }
    // Chuan hoa du lieu approved results

    var cloneResult = [];
    for (let i in results) {
        for (let j in results) {
            if (i < j) {
                // client bắt buộc phải điền contribution khi chấm điểm phê duyệt để chuẩn hóa được dữ liệu ==> fixed
                if (results[i].employee === results[j].employee && results[i].role === results[j].role) {
                    var point, contribute;

                    // do i hoặc j có thể là point hoặc contribute nên phải kiểm tra cả 2 để tính đc point và contribute
                    if (String(results[i].target) === "Point") point = results[i].value;
                    else if (String(results[i].target) === "Contribution") contribute = results[i].value;

                    if (String(results[j].target) === "Point") point = results[j].value;
                    else if (String(results[j].target) === "Contribution") contribute = results[j].value;

                    var cloneItem = {
                        employee: results[i].employee,
                        role: results[i].role,
                        point: point,
                        contribute: contribute
                    }
                    if (point !== undefined || contribute !== undefined) {
                        cloneResult.push(cloneItem);
                    }
                }
            }
        }

    }

    await Task.updateOne({ _id: taskId }, { $set: { status: status[0], progress: progress } });
    var task = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;


    for (let item in cloneResult) {

        var check_data = listResult.find(r => (String(r.employee) === cloneResult[item].employee && r.role === cloneResult[item].role))
        // TH nguoi nay da danh gia ket qua --> thi chi can cap nhat lai ket qua thoi

        if (check_data !== undefined) {
            // cap nhat diem
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,

                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].approvedPoint": cloneResult[item].point,
                        "evaluations.$.results.$[elem].contribution": cloneResult[item].contribute,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[item].employee,
                            "elem.role": cloneResult[item].role
                        }
                    ]
                }
            )

        } else {
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,

                },
                {
                    $push: {
                        "evaluations.$.results": {
                            approvedPoint: cloneResult[item].point,
                            contribution: cloneResult[item].contribute,
                            role: cloneResult[item].role,
                            employee: cloneResult[item].employee,
                            employeePoint: 0
                        }
                    }
                },
                {
                    $new: true
                }
            )

        }

    }



    //cập nhật lại tất cả điểm tự động
    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,

        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint
            }
        }
    )

    var task2 = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    var listResult2 = task2.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    // cập nhật điểm cá nhân cho ng phe duyet

    var check_approve = listResult2.find(r => (String(r.employee) === user && String(r.role) === "Accountable"));


    for (let i in cloneResult) {
        if (String(cloneResult[i].role) === "Accountable") {
            await Task.updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,

                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].employeePoint": cloneResult[i].point,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[i].employee,
                            "elem.role": cloneResult[i].role
                        }
                    ]
                }
            )
        }
    }



    // update Info task
    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();
    var now = new Date();

    var cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly: cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value
                }

                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {

                    await Task.updateOne(
                        {
                            _id: taskId,
                            "taskInformations._id": cloneInfo[i]._id
                        },
                        {
                            $set: {
                                "taskInformations.$.value": cloneInfo[i].value
                            }
                        },
                        {
                            $new: true
                        }
                    )
                }

                await Task.updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value": cloneInfo[i].value
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id
                            }
                        ]
                    }

                )
            }
        }
    }

    // cập nhật thông tin result========================================================END========================================================


    // update date of evaluation

    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId
        },
        {
            $set: {
                "evaluations.$.date": dateFormat
            }
        },
        {
            $new: true
        }
    )

    // update progress of evaluation
    await Task.updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            }
        },
        {
            $new: true,
        }
    );

    // var newTask = await Task.findById(taskId);
    var newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: " responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.kpis.employee", select: "name email _id" },
        { path: "evaluations.kpis.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}
/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (params) => {
    let file = await Task.aggregate([
        { $match: { "taskActions.files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task.findOne({ "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }])
    return task.taskActions;
}
/**
 * Xóa file bình luận của hoạt động
 */
exports.deleteFileCommentOfAction = async (params) => {
    let file = await Task.aggregate([
        { $match: { "taskActions.comments.files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])
    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task.findOne({ "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }])
    return task.taskActions;
}
/**
 * Xóa file trao đổi
 */
exports.deleteFileTaskComment = async (params) => {

    let file = await Task.aggregate([
        { $match: { "taskComments.files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task.findOne({ "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.evaluations.creator", model: User, select: 'name email avatar' }])
    return task.taskComments;
}
/**
 * Xóa file bình luận của bình luận
 */
exports.deleteFileChildTaskComment = async (params) => {
    let file = await Task.aggregate([
        { $match: { "taskComments.comments.files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "comments.files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task.findOne({ "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.evaluations.creator", model: User, select: 'name email avatar' }])
    return task.taskComments;
}

