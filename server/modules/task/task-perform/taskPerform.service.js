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
 * Lấy mẫu công việc theo Id
 */
exports.getTaskById = async (id, userId) => {
    //req.params.id
    var superTask = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator parent" })
        .populate("evaluations.results.employee")
        .populate("evaluations.results.organizationalUnit")
        .populate("evaluations.results.kpis.kpis")

    var task = await Task.findById(id).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id active" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
    ])
    if (!task) {
        return {
            "info": true
        }
    }
    var responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
    responsibleEmployees = task.responsibleEmployees;
    accountableEmployees = task.accountableEmployees;
    consultedEmployees = task.consultedEmployees;
    informedEmployees = task.informedEmployees;
    let flag = 0;
    for (let n in responsibleEmployees) {
        if (responsibleEmployees[n]._id.equals(userId)) {
            flag = 1;
            break;
        }
    }
    if (!flag) {
        for (let n in accountableEmployees) {
            if (accountableEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (!flag) {
        for (let n in consultedEmployees) {
            if (consultedEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (!flag) {
        for (let n in informedEmployees) {
            if (informedEmployees[n]._id.equals(userId)) {
                flag = 1;
                break;
            }
        }
    }
    if (task.creator._id.equals(userId)) {
        flag = 1;
    }

    if (!flag) {// Trưởng đơn vị được phép xem thông tin công việc

        // Tìm danh sách các role mà user kế thừa phân quyền
        let role = await UserRole.find({ userId: userId });
        let listRole = role.map(item => item.roleId);

        let company = [];

        // Tìm ra các đơn vị có role là dean
        for (let i in listRole) {
            let roles = await Role.findById(listRole[i]);
            company[i] = roles.company;
        }

        // Tìm cây đơn vị mà đơn vị gốc có userId có role deans
        let tree = [];
        let k = 0;
        for (let i = 0; i < listRole.length; i++) {
            let com = company[i];
            let r = listRole[i];
            let tr = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(com, r);
            if (tr) {
                tree[k] = tr;
                k++;
            }
        }

        // Duyệt cây đơn vị, kiểm tra xem mỗi đơn vị có id trùng với id của phòng ban công việc
        for (let i = 0; i < listRole.length; i++) {
            let rol = listRole[i];
            if (!flag) {
                for (let j = 0; j < tree.length; j++) {
                    if (tree[j].deans.indexOf(rol) !== -1) {
                        let v = tree[j];
                        let f = await _checkDeans(v, task.organizationalUnit._id);
                        if (f === 1) {
                            flag = 1;
                        }
                    }
                }
            }
        }
    }

    if (flag === 0) {
        return {
            "info": true
        }
    }
    task.evaluations.reverse();
    return task;

}

/**
 * Hàm duyệt cây đơn vị - kiểm tra trong cây có đơn vị của công việc được lấy ra hay không (đệ quy)
 */
_checkDeans = async (v, id) => {
    if (v) {
        if (JSON.stringify(v.id) === JSON.stringify(id)) {
            return 1;
        }
        if (v.children) {
            for (let k = 0; k < v.children.length; k++) {
                return _checkDeans(v.children[k], id);
            }
        }
    }
}


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
    const now = new Date().getTime()
    let stoppedAt

    if (body.stoppedAt) {
        stoppedAt = body.stoppedAt
    } else {
        stoppedAt = now
    }

    let duration = stoppedAt - body.startedAt
    let timer = await Task.findOneAndUpdate(
        { "_id": params.taskId, "timesheetLogs._id": body.timesheetLog },
        {
            $set:
            {
                "timesheetLogs.$.stoppedAt": stoppedAt,
                "timesheetLogs.$.duration": duration,
                "timesheetLogs.$.description": body.description,
            }
        },
        { new: true }
    ).populate({ path: "timesheetLogs.creator", select: "name" });


    timer.hoursSpentOnTask.totalHoursSpent += duration;

    let contributions = timer.hoursSpentOnTask.contributions;
    let check = true;
    let newContributions = contributions.map(item => {
        if (item.employee.toString() === body.employee) {
            check = false;
            return {
                employee: body.employee,
                hoursSpent: item.hoursSpent + duration,
            }
        } else {
            return item;
        }
    })
    if (check) {
        let contributionEmployee = {
            employee: body.employee,
            hoursSpent: duration,
        }
        newContributions.push(contributionEmployee)
    }

    timer.hoursSpentOnTask.contributions = newContributions;

    // Lưu lại thông tin đâ chỉnh sửa
    timer.save();

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
    console.log("555", body)
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
    // đánh giá lần đầu
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
        if (rating.length > 0) {
            let accountableRating = rating.reduce((accumulator, currentValue) => { return accumulator + currentValue }, 0) / rating.length
        }



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
    console.log('loggg', log)
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
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (data, taskId) => {
    let { name, description, kpi, user, progress, info, date } = data;
    let evaluateId;

    const endOfMonth = moment().endOf("month").format('DD-MM-YYYY')

    let task = await Task.findById(taskId);

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
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
 * edit task by responsible employee
 * @param {Object} data dữ liệu cần chỉnh sửa
 * @param {String} taskID id của công việc cần edit
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    let { description, name, priority, status, formula, startDate, endDate, progress, info, date,
        accountableEmployees, consultedEmployees, responsibleEmployees, informedEmployees, inactiveEmployees } = data;

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
                formula: formula,

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
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
    let { user, unit, checkSave, progress, automaticPoint, employeePoint, role, date, kpi, info } = data

    let splitter = date.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

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
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
    let { unit, user, hasAccountable, checkSave, progress, role, date, status, info, results, kpi } = data;

    let automaticPoint = data.automaticPoint === undefined ? 0 : data.automaticPoint;

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

    // cập nhật thông tin result (==============BEGIN============)

    let listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    // TH có điền thông tin result
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

    // cập nhật thông tin result cho cá nhân người phê duyệt

    let listResult2 = task2.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    let curentRole = "Accountable"
    if (!hasAccountable) {
        curentRole = "Responsible"
    }

    // cập nhật điểm cá nhân cho ng phe duyet
    let check_approve = listResult2.find(r => (String(r.employee) === user && String(r.role) === curentRole));
    if (cloneResult.length > 0) {
        for (let i in cloneResult) {
            if (String(cloneResult[i].role) === curentRole && String(cloneResult[i].employee) === String(user)) {
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
    else if (check_approve === undefined) {
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
                        role: curentRole,
                    }
                }
            },
            { $new: true }
        );
    }
    else if (check_approve !== undefined) {
        await Task.updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId
            },
            {
                $set: {
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": curentRole,
                    }
                ]
            })
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

    // cập nhật thông tin result (================END==================)


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
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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

exports.editHoursSpentInEvaluate = async (data, taskId) => {
    let { evaluateId, timesheetLogs } = data;

    let task = await Task.findById(taskId);

    let evaluation = task.evaluations.filter(item => item._id.toString() === evaluateId)[0];

    let results = evaluation.results;

    for (let i in timesheetLogs) {
        let log = timesheetLogs[i];
        let { employee, hoursSpent } = log;
        let check = true;

        let newResults = results.map(item => {
            if (results.employee.toString === employee) {
                check = false;
                return {
                    ...item,
                    hoursSpent: hoursSpent,
                }
            }
            else {
                return item;
            }
        })

        if (check) {
            let employeeHoursSpent = {
                employee: employee,
                hoursSpent: hoursSpent,
            };

            newResults.push(employeeHoursSpent);
        }

        results = [...newResults]
    }

    console.log(result);
}

/**
 * Delete evaluations by month
 * @param {*} params 
 */
exports.deleteEvaluation = async (params) => {
    let { taskId, evaluationId } = params;
    await Task.updateOne(
        { _id: taskId },
        { $pull: { evaluations: { _id: evaluationId } } },
        { $new: true }
    )
    // let newTask = await Task.findById(taskId);
    let newTask = await Task.findById(taskId).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
 * @param body trang thai công việc
 */
exports.editActivateOfTask = async (taskID, body) => {
    let today = new Date();

    let task1 = await Task.findById(taskID);

    let startDate = task1.startDate;
    let endDate = task1.endDate;

    // Cập nhật trạng thái hoạt động của các task sau
    for (let i = 0; i < body.listSelected.length; i++) {
        await Task.findOneAndUpdate(
            {
                _id: taskID,
                "followingTasks.task": body.listSelected[i],
            },
            {
                $set: {
                    "followingTasks.$.activated": true,
                }
            },
        )

        let followStartDate = endDate;

        let followItem = await Task.findById(body.listSelected[i]);
        let numberOfDaysTaken = followItem.numberOfDaysTaken ? followItem.numberOfDaysTaken : 0;
        let timer = followStartDate.getTime() + numberOfDaysTaken * 24 * 60 * 60 * 1000;

        let followEndDate = new Date(timer).toISOString();

        // if (body.status === "Finished") {
        await Task.findByIdAndUpdate(body.listSelected[i],
            {
                $set: {
                    status: "Inprocess",
                    startDate: followStartDate,
                    endDate: followEndDate,
                }
            }
        )
        // }
        // else {
        //     await Task.findByIdAndUpdate(body.listSelected[i],
        //         {
        //             $set: {
        //                 status: "Inprocess",
        //                 endDate: followEndDate,
        //             }
        //         }
        //     )
        // }
    }

    let task = await Task.findById(taskID).populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit", model: OrganizationalUnit },
        { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
        { path: "evaluations.results.employee", select: "name email _id" },
        { path: "evaluations.results.organizationalUnit", select: "name _id" },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.comments.creator", model: User, select: 'name email avatar' },
        { path: "taskActions.evaluations.creator", model: User, select: 'name email avatar ' },
        { path: "taskComments.creator", model: User, select: 'name email avatar' },
        { path: "taskComments.comments.creator", model: User, select: 'name email avatar' },
        { path: "documents.creator", model: User, select: 'name email avatar' },
        { path: "followingTasks.task", model: Task, select: 'name' },
        { path: "preceedingTasks.task", model: Task, select: 'name' },
        {
            path: "process", model: TaskProcess, populate: {
                path: "tasks", model: Task, populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit", model: OrganizationalUnit },
                    { path: "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator", model: User, select: "name email _id" },
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
    task.evaluations.reverse();
    return task
}

/** Xác nhận công việc */
exports.confirmTask = async (taskId, userId) => {

    let confirmedByEmployee = await Task.findByIdAndUpdate(taskId,
        { $push: { confirmedByEmployees: userId } }
    )

    let task = await this.getTaskById(taskId, userId);
    return task;
}

/** Chỉnh sửa taskInformation của task */
exports.editTaskInformation = async (taskId, userId, taskInformations) => {
    let information;

    if (taskInformations && taskInformations.length !== 0) {
        for (let i = 0; i < taskInformations.length; i++) {
            information = await Task.updateOne(
                { "_id": taskId, "taskInformations._id": taskInformations[i]._id },
                {
                    $set:
                    {
                        "taskInformations.$.description": taskInformations[i].description,
                        "taskInformations.$.name": taskInformations[i].name,
                        "taskInformations.$.type": taskInformations[i].type,
                        "taskInformations.$.isOutput": taskInformations[i].isOutput
                    }
                }
            )
        }
    }

    let task = await this.getTaskById(taskId, userId);
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
        { "_id": params.taskId, "documents._id": params.documentId },
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
exports.editDocument = async (taskId, documentId, body, files) => {
    let document;

    if (documentId) {
        document = await Task.updateOne(
            { "_id": taskId, "documents._id": documentId },
            {
                $set:
                {
                    "documents.$.description": body.description,
                    "documents.$.isOutput": body.isOutput
                },

                $push:
                {
                    "documents.$.files": files
                }
            }
        )
    } else {
        if (body && body.length !== 0) {
            for (let i = 0; i < body.length; i++) {
                document = await Task.updateOne(
                    { "_id": taskId, "documents._id": body[i]._id },
                    {
                        $set:
                        {
                            "documents.$.description": body[i].description,
                            "documents.$.isOutput": body[i].isOutput
                        },

                        $push:
                        {
                            "documents.$.files": files
                        }
                    }
                )
            }
        }
    }

    let task = await Task.findById({ _id: taskId }).populate([
        { path: "documents.creator", model: User, select: 'name email avatar' },
    ]);

    return task.documents
}

// exports.activateFollowingTask = async (taskId, activateTasks) => {
//     for(let i in activateTasks) {
//         await Task.findOneAndUpdate(
//             {
//                 _id: taskId,
//                 "followingTasks.task": activateTasks[i],
//             },
//             {
//                 $set: {
//                     "followingTasks.$.activated": true,
//                 }
//             },
//         )
//     }


// }