const mongoose = require("mongoose");
const TimesheetLog = require('../../../models/task/timesheetLog.model');
const Task = require('../../../models/task/task.model');
const TaskTemplateInformation = require('../../../models/task/taskResultInformation.model');
//const TaskFile = require('../../../models/taskFile.model');
const TaskResultInformation = require('../../../models/task/taskResultInformation.model');
const TaskProcess = require('../../../models/task/taskProcess.model');
const User = require('../../../models/auth/user.model');
const fs = require('fs');
const moment = require("moment");

/**
 * Bấm giờ công việc
 * Lấy tất cả lịch sử bấm giờ theo công việc
 */
exports.getTaskTimesheetLogs = async (params) => {
    let timesheetLogs = await Task.findById(params.taskId).populate("timesheetLogs.creator")
    return timesheetLogs.timesheetLogs;
}

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng 
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getActiveTimesheetLog = async (query) => {
    let timerStatus = await Task.findOne(
        { "timesheetLogs": { $elemMatch: { "creator": mongoose.Types.ObjectId(query.userId), "stoppedAt": null } } },
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
exports.startTimesheetLog = async (params, body) => {
    const now = new Date()
    let timerUpdate = {
        startedAt: now,
        creator: body.creator,
    }
    let timer = await Task.findByIdAndUpdate(params.taskId,
        { $push: { timesheetLogs: timerUpdate } },
        { new: true, "fields": { "timesheetLogs": 1, '_id': 1, 'name': 1 } }
    );
    timer.timesheetLogs = timer.timesheetLogs.find(element => !(element.stoppedAt));
    return timer;
}
/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (endTime và time)
 */
exports.stopTimesheetLog = async (params, body) => {
    const now = new Date()
    let duration = now - body.startedAt
    let timer = await Task.findOneAndUpdate(
        { "_id": params.taskId, "timesheetLogs._id": body.timesheetLog },
        {
            $set:
            {
                "timesheetLogs.$.stoppedAt": now,
                "timesheetLogs.$.duration": duration,
                "timesheetLogs.$.description": body.description,
            }
        },
        { new: true }
    ).populate({ path: "timesheetLogs.creator", select: "name" });
    let time = 0;
    timer.timesheetLogs.length > 0 && timer.timesheetLogs.forEach(x => {
        time += x.duration;
    })
    let timer1 = await Task.findOneAndUpdate(
        { "_id": params.taskId, "timesheetLogs._id": body.timesheetLog },
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

    let commenttasks = await Task.updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
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
    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
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
    const now = new Date()
    let action = await Task.updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
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
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
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
    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } }
    ])

    let action = await Task.update(
        { "_id": params.taskId, "taskActions._id": params.actionId, "taskActions.comments._id": params.commentId },
        { $pull: { "taskActions.$.comments": { _id: params.commentId } } },
        { safe: true })
    let i = 0
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }
    let task = await Task.findOne({ _id: params.taskId }).populate([
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
    let actionInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    let taskAction1 = await Task.findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskActions: actionInformation
            }
        },
        { new: true }
    ).populate([{ path: "taskActions.creator", model: User, select: 'name email avatar' },])

    let task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])

    let user = await User.findOne({ _id: body.creator });
    let tasks = await Task.findOne({ _id: params.taskId });
    let userEmail = await User.find({ _id: { $in: tasks.accountableEmployees } });
    let email = userEmail.map(item => item.email);

    return { taskActions: task.taskActions, tasks: tasks, user: user, email: email };
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (params, body, files) => {
    let action = await Task.updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $set:
            {
                "taskActions.$.description": body.description
            }
        }
    )
    let action1 = await Task.updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $push:
            {
                "taskActions.$.files": files
            }
        }
    )
    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])


    let action = await Task.update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
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
    let task = await Task.findOne({ "_id": params.taskId }).populate([
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
        let listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            let listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                let result = await TaskResultInformation.create({
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
        let listResultInfoTask = req.body.listResultInfoTask;
        if (listResultInfoTask !== []) {
            // Lưu thông tin kết quả 
            let listResultInfoTask = await Promise.all(listResultInfoTask.map(async (item) => {
                let result = await TaskResultInformation.findByIdAndUpdate(item._id, {
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
    let item = result;

    if (item !== null) {
        // Lưu thông tin kết quả 
        let resultTask = {
            employee: item.employee,
            role: item.role,
            automaticPoint: item.automaticPoint,
            employeePoint: item.employeePoint,
            approvedPoint: item.approvedPoint
        }
        // Cập nhật thông tin công việc
        let addResult = await Task.updateOne(
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
            let newTask = await Task.updateOne(
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
    let commentInformation = {
        creator: body.creator,
        description: body.description,
        files: files
    }
    let taskComment1 = await Task.findByIdAndUpdate(params.taskId,
        {
            $push:
            {
                taskComments: commentInformation
            }
        },
        { new: true }
    );
    let task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar' }])

    return task.taskComments;
}
/**
 * Sửa bình luận công việc
 */
exports.editTaskComment = async (params, body, files) => {
    let now = new Date()
    let taskComment = await Task.updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        {
            $set:
            {
                "taskComments.$.description": body.description,
                "taskComments.$.updatedAt": now,
            }
        }
    )
    let taskcomment2 = await Task.updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        {
            $push:
            {
                "taskComments.$.files": files
            }
        }
    )

    let task = await Task.findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
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
    let comment = await Task.update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { taskComments: { _id: params.commentId } } },
        { safe: true })
    let task = await Task.findOne({ "_id": params.taskId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskComments;
}
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (params, body, files) => {
    let taskcomment = await Task.updateOne(
        { "_id": params.taskId, "taskComments._id": params.commentId },
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


    let taskComment = await Task.findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
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
        //thieu 1 tham so child comment
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
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
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
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

    let taskComment = await Task.findOne({ "_id": params.taskId, "taskComments.comments._id": params.commentId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
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
        { "_id": params.taskId, "taskComments.comments._id": params.commentId },
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
    let taskComment = await Task.findOne({ _id: params.taskId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
        .select("taskComments");

    return taskComment.taskComments;
}
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (params, body) => {
    // đánh giá
    if (body.firstTime === 1) {
        //cập nhật điểm người đánh giá
        let evaluationAction = await Task.updateOne(
            { "_id": params.taskId, "taskActions._id": params.actionId },
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
        let task1 = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId })
        let accountableEmployees = task1.accountableEmployees



        //danh sách các đánh giá
        let evaluations = await Task.aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
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
                { "_id": params.taskId, "taskActions._id": params.actionId },
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
            { $and: [{ "_id": params.taskId, "taskActions._id": params.actionId }, { "taskActions.evaluations.creator": body.creator }] },
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
                            "item._id": params.actionId
                        }
                    ]
            }
        )
    }

    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }
    ]);

    return task.taskActions;
}
/**
 * Xác nhận hành động
 */
exports.confirmAction = async (params, body) => {

    let evaluationActionRating = await Task.updateOne(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        {
            $set: {
                "taskActions.$.creator": body.userId,
                "taskActions.$.createdAt": Date.now()
            }
        }
    )

    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
        { path: "taskActions.creator", model: User, select: 'name email avatar ' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' }])
    return task.taskActions;
}
/**
 * Upload tài liệu cho cộng việc
 */
exports.uploadFile = async (params, body, files) => {
    let files1 = {
        files: files,
        creator: body.creator,
        description: body.description
    }
    let task1 = await Task.updateOne(
        { _id: params.taskId },
        {
            $push: {
                documents: files1
            }
        }
    )

    let task = await Task.findOne({ _id: params.taskId }).populate([
        { path: "documents.creator", model: User, select: 'name email avatar' },
    ]);

    return task.documents
}

/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (params, body) => {
    let { creator, title, description, createdAt } = body;

    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: description,
    }

    let task = await Task.findByIdAndUpdate(
        params.taskId, { $push: { logs: log } }, { new: true }
    ).populate("logs.creator");
    let taskLog = task.logs.reverse();

    return taskLog;
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (params) => {
    let task = await Task.findById(params.taskId).populate("logs.creator")

    return task.logs.reverse();
}

/**
 * hàm convert dateISO sang string
 */
formatDate = (date) => {
    let d = new Date(date),
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
    let evaluateId;
    let splitterStoreDate = storeDate.split("-");
    let storeDateISO = new Date(splitterStoreDate[2], splitterStoreDate[1] - 1, splitterStoreDate[0]);

    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let testCase;

    // kiểm tra evaluations
    let initTask = await Task.findById(taskId);

    let cloneTaskInfo = [];
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
        let chk = initTask.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()));
        if (!chk) { // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else { // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }

    // TH1: chưa có evaluations => tạo mới
    if (testCase === "TH1") {

        let evaluationsVer1 = {
            date: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo
        }
        let taskV1 = await Task.updateOne({ _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer1
                }
            },
            {
                $new: true
            }
        );
        let taskV2 = await Task.findById(taskId);
        evaluateId = taskV2.evaluations[0]._id;

    }

    // TH2: Có evaluation nhưng chưa có tháng giống với date => tạo mới
    else if (testCase === "TH2") {

        let evaluationsVer2 = {
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

        let taskV2 = await Task.findById(taskId);
        evaluateId = taskV2.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;
    }

    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    else if (testCase === "TH3") {

        let taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;

    }

    return evaluateId;
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByResponsibleEmployees = async (data, taskId) => {
    let description = data.description;
    let name = data.name;
    let kpi = data.kpi;
    let user = data.user;
    let progress = data.progress;
    let info = data.info;
    // let kpisItem = {
    //     employee: user,
    //     kpis: kpi
    // };
    let date = data.date;
    let evaluateId;

    const endOfMonth = moment().endOf("month").format('DD-MM-YYYY')


    // evaluateId = await checkEvaluations(date, taskId, endOfMonth);
    let task = await Task.findById(taskId);

    // cập nhật thông tin kpi

    // let listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis
    // let check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    // if (check_kpi === undefined) {
    //     await Task.updateOne(
    //         {
    //             _id: taskId,
    //             "evaluations._id": evaluateId
    //         },
    //         {
    //             $push: {
    //                 "evaluations.$.kpis": kpisItem
    //             }
    //         },
    //         { $new: true }
    //     );
    // } else {
    //     await Task.updateOne(
    //         {
    //             _id: taskId,
    //             "evaluations._id": evaluateId,

    //         },
    //         {
    //             $set: {
    //                 "evaluations.$.kpis.$[elem].kpis": kpi
    //             }
    //         },
    //         {
    //             arrayFilters: [
    //                 {
    //                     "elem.employee": user
    //                 }
    //             ]
    //         }
    //     );
    // }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
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

    // let task = await Task.findById(taskId);
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

    // let newTask = await this.getTask(taskId).info;
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);

    //xu ly gui email
    let tasks = await Task.findById(taskId);
    let userId = tasks.accountableEmployees;
    let user1 = await User.find({ _id: { $in: userId } });
    let email = user1.map(item => item.email);
    user = await User.findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    let description = data.description;
    let name = data.name;
    let priority = data.priority;
    let status = data.status;

    let startDate = data.startDate;
    let endDate = data.endDate;

    // let user = data.user;
    let progress = data.progress;
    let info = data.info;
    // let evaluateId = data.evaluateId;
    let accountableEmployees = data.accountableEmployees;
    let consultedEmployees = data.consultedEmployees;
    let responsibleEmployees = data.responsibleEmployees;
    let informedEmployees = data.informedEmployees;
    let inactiveEmployees = data.inactiveEmployees;

    // let date = Date.now();
    let date = data.date;

    // Chuẩn hóa ngày bắt đầu và ngày kết thúc
    let splitStartDate = startDate.split("-");
    let startOfTask = new Date(splitStartDate[2], splitStartDate[1] - 1, splitStartDate[0]);

    let splitEndDate = endDate.split("-");
    let endOfTask = new Date(splitEndDate[2], splitEndDate[1] - 1, splitEndDate[0]);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
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
    let task = await Task.findById(taskId);


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



    // let newTask = await Task.findById(taskId);
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);

    //xu ly gui email
    let tasks = await Task.findById(taskId);
    let userId = tasks.responsibleEmployees;
    let user = await User.find({ _id: { $in: userId } });
    let email = user.map(item => item.email);
    user = await User.findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };

}

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (data, taskId) => {
    let user = data.user;
    // let evaluateId = data.evaluateId;
    let { automaticPoint, employeePoint, kpi, unit, role, date } = data;
    let evaluateId = await checkEvaluations(date, taskId, date);

    let resultItem = {
        employee: user,
        employeePoint: employeePoint,
        organizationalUnit: unit,
        kpis: kpi,
        automaticPoint: automaticPoint,
        role: role
    }
    let task = await Task.findById(taskId);

    // cập nhật thông tin result

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results


    let check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "Consulted"));
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
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint,
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
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
    // let newTask = await Task.findById(taskId);
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (data, taskId) => {
    let user = data.user;
    let unit = data.unit;
    let checkSave = data.checkSave;
    let progress = data.progress;
    let automaticPoint = data.automaticPoint;
    let employeePoint = data.employeePoint;

    let role = data.role;

    let date = data.date;
    let kpi = data.kpi;
    let info = data.info;

    let splitter = date.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    // let kpisItem = {
    //     employee: user,
    //     kpis: kpi
    // }

    let resultItem = {
        employee: user,
        organizationalUnit: unit,
        kpis: kpi,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role
    }

    let evaluateId = await checkEvaluations(date, taskId, date);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) { // !== undefined || info[i].value !== null
            if (info[i].type === "Number") info[i].value = parseInt(info[i].value);
            else if (info[i].type === "SetOfValues") info[i].value = info[i].value[0];
            else if (info[i].type === "Date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }

    checkSave && await Task.updateOne({ _id: taskId }, { $set: { progress: progress } }, { $new: true });

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

    let task = await Task.findById(taskId);

    // let listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis

    // let check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    // if (check_kpi === undefined) {
    //     await Task.updateOne(
    //         {
    //             _id: taskId,
    //             "evaluations._id": evaluateId
    //         },
    //         {
    //             $push: {
    //                 "evaluations.$.kpis": kpisItem
    //             }
    //         },
    //         { $new: true }
    //     );
    // } else {
    //     await Task.updateOne(
    //         {
    //             _id: taskId,
    //             "evaluations._id": evaluateId,

    //         },
    //         {
    //             $set: {
    //                 "evaluations.$.kpis.$[elem].kpis": kpi
    //             }
    //         },
    //         {
    //             arrayFilters: [
    //                 {
    //                     "elem.employee": user
    //                 }
    //             ]
    //         }
    //     );
    // }

    // cập nhật thông tin result

    // let listResult = task.evaluations[task.evaluations.length-1].results;
    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    let check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "Responsible"));
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
                    "evaluations.$.results.$[elem].automaticPoint": automaticPoint,
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
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
    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
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
                // quangdz
                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {
                    // console.log('quang vào update');
                    checkSave && await Task.updateOne(
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

    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (data, taskId) => {
    let user = data.user;
    let checkSave = data.checkSave;
    let progress = data.progress;

    let automaticPoint = data.automaticPoint === undefined ? 0 : data.automaticPoint;
    let role = data.role;

    let date = data.date;
    let status = data.status; // neu ket thuc thi moi thay doi, con neu la danh gia thi k doi
    let info = data.info;
    let results = data.results;

    let unit = data.unit;
    let kpi = data.kpi;

    let splitter = date.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let evaluateId = await checkEvaluations(date, taskId, date);

    // lấy info có value khác undefined
    let filterInfo = [];
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
                let splitter = info[i].value.split("-");
                let infoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                info[i].value = infoDate;
            }
        }
    }
    // Chuan hoa du lieu approved results

    let cloneResult = [];
    for (let i in results) {
        for (let j in results) {
            if (i < j) {
                // client bắt buộc phải điền contribution khi chấm điểm phê duyệt để chuẩn hóa được dữ liệu ==> fixed
                if (results[i].employee === results[j].employee && results[i].role === results[j].role) {
                    let point, contribute;

                    // do i hoặc j có thể là point hoặc contribute nên phải kiểm tra cả 2 để tính đc point và contribute
                    if (String(results[i].target) === "Point") point = results[i].value;
                    else if (String(results[i].target) === "Contribution") contribute = results[i].value;

                    if (String(results[j].target) === "Point") point = results[j].value;
                    else if (String(results[j].target) === "Contribution") contribute = results[j].value;

                    let cloneItem = {
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

    await Task.updateOne({ _id: taskId }, { $set: { status: status[0] } });
    let task = await Task.findById(taskId);

    checkSave && await Task.updateOne({ _id: taskId }, { $set: { progress: progress } });
    task = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;


    for (let item in cloneResult) {

        let check_data = listResult.find(r => (String(r.employee) === cloneResult[item].employee && r.role === cloneResult[item].role))
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

    let task2 = await Task.findById(taskId);

    // cập nhật thông tin result====================================BEGIN=====================================================

    let listResult2 = task2.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    // cập nhật điểm cá nhân cho ng phe duyet
    let check_approve = listResult2.find(r => (String(r.employee) === user && String(r.role) === "Accountable"));

    if (cloneResult.length > 0) {
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
                            "evaluations.$.results.$[elem].organizationalUnit": unit,
                            "evaluations.$.results.$[elem].kpis": kpi,
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
    }
    else {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $push: {
                    "evaluations.$.results": {
                        organizationalUnit: unit,
                        kpis: kpi,
                        employee: user,
                        role: "Accountable",
                    }
                }
            },
            { $new: true }
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
    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
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
                //quangdz
                if (yearOfParams > now.getFullYear() || (yearOfParams <= now.getFullYear() && monthOfParams >= now.getMonth())) {

                    checkSave && await Task.updateOne(
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

    // cập nhật thông tin result======================================END================================================


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

    // let newTask = await Task.findById(taskId);
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}

/**
 * Delete evaluations by month
 * @param {*} params 
 */
exports.deleteEvaluation = async (params) => {
    let { taskId, evaluationId } = params;
    await Task.updateOne(
        {_id: taskId},
        { $pull: {evaluations: { _id: evaluationId} } },
        {$new: true}
    )
    // let newTask = await Task.findById(taskId);
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator", model: User, select: "name email _id" },
                    { path: "evaluations.results.employee", select: "name email _id" },
                    { path: "evaluations.results.organizationalUnit", select: "name _id" },
                    { path: "evaluations.results.kpis" },
                    { path: "taskActions.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
                    { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
                    { path: "taskComments.creator", model: User, select: 'name email avatar' },
                    { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
                    { path: "documents.creator", model: User, select: 'name email avatar' },
                    { path: "process", model: TaskProcess },
                ]
            }
        },
    ]);
    newTask.evaluations.reverse();

    return newTask;
}


/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (params) => {
    let file = await Task.aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])
    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "_id": params.taskId, "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task.findOne({ "_id": params.taskId, "taskActions._id": params.actionId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.files": { _id: params.fileId } } },
        { safe: true }
    )
    let task = await Task.findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
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
        { $match: { "_id": mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { "_id": mongoose.Types.ObjectId(params.fileId) } }
    ])

    fs.unlinkSync(file[0].url)

    let action = await Task.update(
        { "_id": params.taskId, "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.comments.$[].files": { _id: params.fileId } } },
        { safe: true }
    )

    let task = await Task.findOne({ "_id": params.taskId, "taskComments._id": params.commentId }).populate([
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.evaluations.creator", model: User, select: 'name email avatar' }])
    return task.taskComments;
}




/**
 * edit status of task 
 * @param taskID id công việc
 * @param status trang thai công việc
 */
exports.editTaskStatus = async (taskID, status) => {
    let task = await Task.findByIdAndUpdate(taskID,
        { $set: { status: status } },
        { new: true }
    );
    return task;
}

/**
 * Chinh sua trang thai luu kho cua cong viec
 * @param taskID id công việc
 */
exports.editArchivedOfTask = async (taskID) => {
    let t = await Task.findByIdAndUpdate(taskID);
    let isArchived = t.isArchived;

    let task = await Task.findByIdAndUpdate(taskID,
        { $set: { isArchived: !isArchived } },
        { new: true }
    );

    return task;
}

/**
 * Xoa file cua task
 */
exports.deleteFileTask = async (params) => {
    let file = await Task.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } }
    ])
    console.log(file)
    fs.unlinkSync(file[0].url)

    let task = await Task.update(
        { "_id": params.taskId, "documents._id": params.documentId, "documents.files._id": params.fileId },
        { $pull: { "documents.$.files": { "_id": params.fileId } } },
        { safe: true }
    )
    let task1 = await Task.findById({ _id: params.taskId }).populate([
        { path: "documents.creator", model: User, select: 'name email avatar' },
    ]);

    return task1.documents;
}

/**
 * Xoa document cua task
 */
exports.deleteDocument = async (params) => {
    let files = await Task.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ])
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url)
    }

    let task = await Task.update(
        { "_id": params.taskId, "documents._id": params.documentId},
        { $pull: { "documents": { "_id": params.documentId } } },
        { safe: true }
    )
    let task1 = await Task.findById({ _id: params.taskId }).populate([
        { path: "documents.creator", model: User, select: 'name email avatar' },
    ]);

    return task1.documents;
}
/**
 * Sua document
 */
exports.editDocument = async (params,body,files) => {
    console.log(body)
    let document = await Task.updateOne(
        { "_id": params.taskId, "documents._id": params.documentId },
        {
            $set:
            {
                "documents.$.description": body.description
            }
        }
    )
    let action1 = await Task.updateOne(
        { "_id": params.taskId, "documents._id": params.documentId },
        {
            $push:
            {
                "documents.$.files": files
            }
        }
    )
    let task1 = await Task.findById({ _id: params.taskId }).populate([
        { path: "documents.creator", model: User, select: 'name email avatar' },
    ]);

    return task1.documents
}