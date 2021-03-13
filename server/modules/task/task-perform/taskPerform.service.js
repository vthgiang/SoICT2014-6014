const mongoose = require("mongoose");
const fs = require("fs");
const moment = require("moment");
const nodemailer = require("nodemailer");
const sumBy = require('lodash/sumBy');

const { Task, User, UserRole, Role, OrganizationalUnit, OrganizationalUnitKpi, EmployeeKpi } = require(`../../../models`);

const OrganizationalUnitService = require(`../../super-admin/organizational-unit/organizationalUnit.service`);
const NotificationServices = require(`../../notification/notification.service`);
const UserService = require('../../super-admin/user/user.service');

const { connect } = require(`../../../helpers/dbHelper`);

/*
 * Lấy công việc theo Id
 */
exports.getTaskById = async (portal, id, userId) => {
    let task = await Task(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            { path: "requestToCloseTask.requestedBy", select: "name email _id active" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    if (!task) {
        return {
            info: true,
        };
    }
    var responsibleEmployees,
        accountableEmployees,
        consultedEmployees,
        informedEmployees;
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

    if (!flag) {
        // Trưởng đơn vị quản lý công việc và trưởng đơn vị phối hợp được phép xem thông tin công việc

        // Tìm danh sách các role mà user kế thừa phân quyền
        let role = await UserRole(connect(DB_CONNECTION, portal)).find({
            userId: userId,
        });
        let listRole = role.map((item) => item.roleId);

        let company = [];

        // Tìm ra các đơn vị có role là manager
        for (let i in listRole) {
            let roles = await Role(connect(DB_CONNECTION, portal)).findById(
                listRole[i]
            );
            company[i] = roles.company;
        }

        // Tìm cây đơn vị mà đơn vị gốc có userId có role managers
        let tree = [];
        let k = 0;
        for (let i = 0; i < listRole.length; i++) {
            let r = listRole[i];
            let tr = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(
                portal,
                r
            );
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
                    if (tree[j].managers.indexOf(rol) !== -1) {
                        let v = tree[j];
                        let f = await _checkManagers(
                            v,
                            task.organizationalUnit._id
                        );
                        if (!f) {
                            // Check trưởng đơn vị phối hợp
                            for (
                                let k = 0;
                                k <
                                task.collaboratedWithOrganizationalUnits.length;
                                k++
                            ) {
                                if (
                                    !f &&
                                    task.collaboratedWithOrganizationalUnits[
                                    k
                                    ] &&
                                    task.collaboratedWithOrganizationalUnits[k]
                                        .organizationalUnit
                                ) {
                                    f = await _checkManagers(
                                        v,
                                        task
                                            .collaboratedWithOrganizationalUnits[
                                            k
                                        ].organizationalUnit._id
                                    );
                                }
                            }
                        }
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
            info: true,
        };
    }
    task.evaluations.reverse();
    return task;
};

/**
 * Hàm duyệt cây đơn vị - kiểm tra trong cây có đơn vị của công việc được lấy ra hay không (đệ quy)
 */
_checkManagers = async (v, id) => {
    if (v) {
        if (JSON.stringify(v.id) === JSON.stringify(id)) {
            return 1;
        }
        if (v.children) {
            for (let k = 0; k < v.children.length; k++) {
                return _checkManagers(v.children[k], id);
            }
        }
    }
};

/**
 * Bấm giờ công việc
 * Lấy tất cả lịch sử bấm giờ theo công việc
 */
exports.getTaskTimesheetLogs = async (portal, params) => {
    let timesheetLogs = await Task(connect(DB_CONNECTION, portal))
        .findById(params.taskId)
        .populate({path: "timesheetLogs.creator", select: "_id name email avatar"});
    return timesheetLogs.timesheetLogs;
};

/**
 * Lấy trạng thái bấm giờ hiện tại. Bảng TimesheetLog tìm hàng có endTime là rỗng
 * Nếu có trả về startTimer: true, và time, startTime. Không có trả ver startTimer: false
 */
exports.getActiveTimesheetLog = async (portal, query) => {
    let timerStatus = await Task(connect(DB_CONNECTION, portal)).findOne(
        {
            timesheetLogs: {
                $elemMatch: {
                    creator: query.userId,
                    stoppedAt: null,
                },
            },
        },
        { timesheetLogs: 1, _id: 1, name: 1 }
    );
    if (timerStatus !== null) {
        timerStatus.timesheetLogs = timerStatus.timesheetLogs.find(
            (element) => !element.stoppedAt && element.creator == query.userId
        );

        return timerStatus;
    } else {
        return null;
    }
};

/**
 * Bắt đầu bấm giờ: Lưu thời gian bắt đầu
 */
exports.startTimesheetLog = async (portal, params, body) => {
    const now = new Date();
    let timerUpdate = {
        startedAt: now,
        creator: body.creator,
    };

    /* check và tìm công việc đang được hẹn tắt bấm giờ:
    * Nếu công tìm được công việc có thời gian kết thúc bấm giờ lớn hơn thời gin hiện tại
    * => Thì chứng tỏ công việc đấy đang được hẹn tắt giờ
    */
    let checkAutoTSLog = await Task(connect(DB_CONNECTION, portal)).findOne({
        "timesheetLogs.creator": body.creator,
        "timesheetLogs.acceptLog": true,
        "timesheetLogs.stoppedAt": { $exists: true },
        "timesheetLogs.stoppedAt": { $gt: timerUpdate.startedAt }
    }, { 'timesheetLogs.$': 1, '_id': 1, 'name': 1 });

    // Kiểm tra thời điểm bắt đầu bấm giờ có nằm trong khoảng thời gian hẹn tắt bấm giờ tự động không?
    if (body.overrideTSLog === 'yes') {
        // Nếu người dùng ấn xác nhận bấm giờ công việc mới thì sẽ lưu lại khoảng thời gian mà người dùng bám được cho tới hiện tại
        const timesheetLogs = checkAutoTSLog.timesheetLogs;
        const duration = new Date().getTime() - timesheetLogs[0].startedAt.getTime();
        let checkDurationValid = duration / (60 * 60 * 1000);

        const result = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate({
            "timesheetLogs.creator": body.creator,
            "timesheetLogs.acceptLog": true,
            "timesheetLogs.stoppedAt": { $exists: true },
            "timesheetLogs.stoppedAt": { $gt: timerUpdate.startedAt }
        }, {
            $set: {
                "timesheetLogs.$[i].stoppedAt": new Date(),
                "timesheetLogs.$[i].duration": duration, // Cập nhạt lị thời gian làm việc mới
                "timesheetLogs.$[i].acceptLog": checkDurationValid > 24 ? false : true,
            },
        }, {
            arrayFilters: [
                {
                    "i.creator": body.creator,
                    "i.stoppedAt": { $exists: true },
                    "i.stoppedAt": { $gt: timerUpdate.startedAt }
                },
            ],
            new: true
        })

        // Cộng tổng thời gian đóng góp trong công việc thoe duration mới
        let newTotalHoursSpent = sumBy(result.timesheetLogs, function (o) { return o.duration })

        //cần cập nhật lại thời gian đóng góp của từng người trong hoursSpentOnTask.contributions
        let contributions = [];
        result.timesheetLogs.reduce(function (res, value) {
            if (!res[value.creator]) {
                res[value.creator] = { employee: value.creator, hoursSpent: 0 };
                contributions.push(res[value.creator])
            }
            if (value.duration)
                res[value.creator].hoursSpent += value.duration;
            return res;
        }, {});


        await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
            { _id: checkAutoTSLog._id },
            {
                $set: {
                    "hoursSpentOnTask.totalHoursSpent": newTotalHoursSpent,
                    "hoursSpentOnTask.contributions": contributions,
                },
            },
            { new: true }
        );
    } else {
        if (checkAutoTSLog) throw ['time_overlapping', checkAutoTSLog.name]
    }

    let timer = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
        params.taskId,
        { $push: { timesheetLogs: timerUpdate } },
        { new: true, fields: { timesheetLogs: 1, _id: 1, name: 1 } }
    );

    timer.timesheetLogs = timer.timesheetLogs.find(
        (element) => (!element.stoppedAt && element.creator == body.creator)
    );

    return timer;
};

/**
 * Chỉnh sửa lịch sử bấm giờ
 */
exports.editTimeSheetLog = async (portal, taskId, timesheetlogId, data) => {
    await Task(connect(DB_CONNECTION, portal))
        .updateOne({
            "_id": taskId,
            "timesheetLogs._id": timesheetlogId
        }, {
            $set: {
                "timesheetLogs.$[i].acceptLog": data.acceptLog
            },
        }, {
            arrayFilters: [
                {
                    "i._id": timesheetlogId
                },
            ],
        });

    return await Task(connect(DB_CONNECTION, portal))
    .findById(taskId)
    .populate([
        { path: "parent", select: "name" },
        { path: "taskTemplate", select: "formula" },
        { path: "organizationalUnit" },
        { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
        {
            path:
                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
            select: "name email _id active avatar",
        },
        {
            path: "evaluations.results.employee",
            select: "name email _id active",
        },
        {
            path: "evaluations.results.organizationalUnit",
            select: "name _id",
        },
        { path: "evaluations.results.kpis" },
        { path: "taskActions.creator", select: "name email avatar" },
        {
            path: "taskActions.comments.creator",
            select: "name email avatar",
        },
        { path: "commentsInProcess.creator", select: "name email avatar" },
        {
            path: "commentsInProcess.comments.creator",
            select: "name email avatar",
        },
        {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
        },
        { path: "taskComments.creator", select: "name email avatar" },
        {
            path: "taskComments.comments.creator",
            select: "name email avatar",
        },
        { path: "documents.creator", select: "name email avatar" },
        { path: "followingTasks.task" },
        {
            path: "preceedingTasks.task",
            populate: [
                {
                    path: "commentsInProcess.creator",
                    select: "name email avatar",
                },
                {
                    path: "commentsInProcess.comments.creator",
                    select: "name email avatar",
                },
            ],
        },
        { path: "timesheetLogs.creator", select: "name avatar _id email" },
        { path: "hoursSpentOnTask.contributions.employee", select: "name" },
        {
            path: "process",
            populate: {
                path: "tasks",
                populate: [
                    { path: "parent", select: "name" },
                    { path: "taskTemplate", select: "formula" },
                    { path: "organizationalUnit" },
                    {
                        path:
                            "collaboratedWithOrganizationalUnits.organizationalUnit",
                    },
                    {
                        path:
                            "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                        select: "name email _id active avatar",
                    },
                    {
                        path: "evaluations.results.employee",
                        select: "name email _id active",
                    },
                    {
                        path: "evaluations.results.organizationalUnit",
                        select: "name _id",
                    },
                    { path: "evaluations.results.kpis" },
                    {
                        path: "taskActions.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "taskActions.comments.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "taskActions.evaluations.creator",
                        select: "name email avatar ",
                    },
                    {
                        path: "taskComments.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "taskComments.comments.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "documents.creator",
                        select: "name email avatar",
                    },
                    { path: "process" },
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
        },
    ]);
}

/**
 * Dừng bấm giờ: Lưu thời gian kết thúc và số giờ chạy (endTime và time)
 */
exports.stopTimesheetLog = async (portal, params, body, user) => {
    let stoppedAt;
    let timer, duration;
    
    // Add log timer
    if (body.addlogStartedAt && body.addlogStoppedAt) {
        let getAddlogStartedAt = new Date(body.addlogStartedAt);
        let getAddlogStoppedAt = new Date(body.addlogStoppedAt);

        // Lưu vào timeSheetLog
        duration = new Date(getAddlogStoppedAt).getTime() - new Date(getAddlogStartedAt).getTime();
        const addLogTime = {
            startedAt: getAddlogStartedAt,
            stoppedAt: getAddlogStoppedAt,
            duration,
            autoStopped: body.autoStopped,
            description: body.addlogDescription,
            creator: user._id,
        }
        timer = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            params.taskId,
            { $push: { timesheetLogs: addLogTime } },
            { new: true }
        ).populate({ path: "timesheetLogs.creator", select: "name" });

    } else {
        if (body.autoStopped === 1) {
            stoppedAt = new Date();
        } else {
            stoppedAt = new Date(body.stoppedAt);
        }

        // Lưu vào timeSheetLog
        duration = new Date(stoppedAt).getTime() - new Date(body.startedAt).getTime();
        let checkDurationValid = duration / (60 * 60 * 1000);

        timer = await Task(connect(DB_CONNECTION, portal))
            .findOneAndUpdate(
                { _id: params.taskId, "timesheetLogs._id": body.timesheetLog },
                {
                    $set: {
                        "timesheetLogs.$.stoppedAt": stoppedAt, // Date
                        "timesheetLogs.$.duration": duration, // mileseconds
                        "timesheetLogs.$.description": body.description,
                        "timesheetLogs.$.autoStopped": body.autoStopped, // ghi nhận tắt bấm giờ tự động hay không?
                        "timesheetLogs.$.acceptLog": checkDurationValid > 24 ? false : true, // tự động check nếu thời gian quá 24 tiếng thì đánh là không hợp lệ
                    },
                },
                { new: true }
            )
            .populate({ path: "timesheetLogs.creator", select: "name" });
    }

    // Lưu vào hoursSpentOnTask
    let newTotalHoursSpent = timer.hoursSpentOnTask.totalHoursSpent + duration;
    let contributions = timer.hoursSpentOnTask.contributions;
    let check = true;
    let newContributions = contributions.map((item) => {
        if (item.employee && item.employee.toString() === body.employee) {
            check = false;
            return {
                employee: body.employee,
                hoursSpent: item.hoursSpent + duration,
            };
        } else {
            return item;
        }
    });
    if (check) {
        let contributionEmployee = {
            employee: body.employee,
            hoursSpent: duration,
        };
        if (!newContributions) {
            newContributions = [];
        }
        newContributions.push(contributionEmployee);
    }

    let newTask = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { _id: params.taskId },
        {
            $set: {
                "hoursSpentOnTask.totalHoursSpent": newTotalHoursSpent,
                "hoursSpentOnTask.contributions": newContributions,
            },
        }
    );
    newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(params.taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/** Lấy các nhân viên đang bấm giờ trong 1 đơn vị */
exports.getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit = async (portal, data) => {
    const { organizationalUnitId } = data;
    let employees;
    let users = await UserService.getAllEmployeeOfUnitByIds(portal, organizationalUnitId);
    if (users && users.length !== 0) {
        employees = users.map(item => item?.userId?._id)
    }

    const now = new Date();
    let keySearch = {
        creator: { $in: employees },
        $or: [
            { stoppedAt: { $exists: false } },          // Trường hợp chưa có stopped
            {
                $and: [                                 // Trường hợp hẹn tắt giờ
                    { 'autoStopped': 2 },
                    { 'startedAt': { $lte: now } },
                    { 'stoppedAt': { $gte: now } }
                ]
            }
        ]
    }

    let timesheetLog = await Task(connect(DB_CONNECTION, portal)).aggregate([
        {
            $match: {
                timesheetLogs: { $elemMatch: keySearch }
            }
        },

        { $unwind: '$timesheetLogs' },

        {
            $addFields: { "timesheetLogs.task": { _id: '$_id', name: '$name' } }
        },

        { $replaceRoot: { newRoot: '$timesheetLogs' } },

        { $match: keySearch }
    ])

    await User(connect(DB_CONNECTION, portal)).populate(timesheetLog, { path: 'creator', select: '_id name email' });

    return timesheetLog;
}

/**
 * Thêm bình luận của hoạt động
 */
exports.createCommentOfTaskAction = async (portal, params, body, files, user) => {
    let commentOfTaskAction = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $push: {
                "taskActions.$.comments": {
                    creator: body.creator,
                    description: body.description,
                    files: files,
                },
            },
        }, { new: true }
    ).populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            { path: "requestToCloseTask.requestedBy", select: "name email _id active" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
    ]);
    
    const { taskActions } = commentOfTaskAction;

    // Lấy ra hoạt động cha
    let getTaskAction = [];
    const taskActionsLength = taskActions.length;
    for (let i = 0; i < taskActionsLength; i++) {
        if (JSON.stringify(taskActions[i]._id) === JSON.stringify(params.actionId)) {
            getTaskAction = [taskActions[i]];
            break; // Tìm thấy thì dừng vòng lặp luôn
        }
    }

    // Lấy danh sách user dự tính gửi thông báo
    let userReceive = [getTaskAction[0].creator._id]; // Người tạo hoạt động cha

    // Lấy người liên quan đến trong subcomment 
    const subCommentOfTaskActionsLength = getTaskAction[0].comments.length;

    for (let index = 0; index < subCommentOfTaskActionsLength; index++) {
        userReceive = [...userReceive, getTaskAction[0].comments[index].creator._id];
    }

    // Loại bỏ người gửi sub comment ra khỏi danh sách user dc nhận thông báo 
    userReceive = userReceive.filter(obj => obj.toString() !== user._id.toString())

    const associatedData = {
        dataType: "realtime_tasks",
        value: commentOfTaskAction,
    }

    const data = {
        organizationalUnits: commentOfTaskAction.organizationalUnit && commentOfTaskAction.organizationalUnit._id,
        title: "Cập nhật thông tin công việc ",
        level: "general",
        content: `<p><strong>${user.name}</strong> đã bình luận về hoạt động trong công việc: <a href="${process.env.WEBSITE}/task?taskId=${params.taskId}">${process.env.WEBSITE}/task?taskId=${params.taskId}</a></p>`,
        sender: `${user.name}`,
        users: userReceive,
        associatedData: associatedData,
        associatedDataObject: {
            dataType: 1,
            description: `<p><strong>${commentOfTaskAction.name}</strong>: ${user.name} đã bình luận về hoạt động mà bạn tham gia.`
        }
    };

    if (userReceive && userReceive.length > 0)
        NotificationServices.createNotification(portal, user.company._id, data)
    return taskActions;
};
/**
 * Sửa nội dung bình luận hoạt động
 */
exports.editCommentOfTaskAction = async (portal, params, body, files) => {
    const now = new Date();
    let action = await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: params.taskId,
            "taskActions._id": params.actionId,
            "taskActions.comments._id": params.commentId,
        },
        {
            $set: {
                "taskActions.$.comments.$[elem].description": body.description,
                "taskActions.$.comments.$[elem].updatedAt": now,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.commentId,
                },
            ],
        }
    );
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: params.taskId,
            "taskActions._id": params.actionId,
            "taskActions.comments._id": params.commentId,
        },
        {
            $push: {
                "taskActions.$.comments.$[elem].files": files,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.commentId,
                },
            ],
        }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({
            _id: params.taskId,
            "taskActions._id": params.actionId,
            "taskActions.comments._id": params.commentId,
        })
        .populate([
            { path: "taskActions.creator", select: "name email avatar " },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar ",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ])
        .select("taskActions");
    return task.taskActions;
};

/**
 * Xóa bình luận hoạt động
 */
exports.deleteCommentOfTaskAction = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        {
            _id: params.taskId,
            "taskActions._id": params.actionId,
            "taskActions.comments._id": params.commentId,
        },
        { $pull: { "taskActions.$.comments": { _id: params.commentId } } },
        { safe: true }
    );
    let i = 0;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar " },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar ",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar",
            },
        ])
        .select("taskActions");
    return task.taskActions;
};
/**
 * Thêm hoạt động cho công việc
 */

exports.createTaskAction = async (portal, params, body, files) => {
    let actionInformation = {
        creator: body.creator,
        description: body.description,
        files: files,
    };
    const task = await Task(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            params.taskId,
            {
                $push: {
                    taskActions: {
                        $each: [actionInformation],
                    },
                },
            }, { new: true })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            { path: "requestToCloseTask.requestedBy", select: "name email _id active" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);

    // let user = await User(connect(DB_CONNECTION, portal)).findOne({ _id: body.creator }); // Thừa 
    let getUser, accEmployees;
    if (task) {
        const length = task.taskActions.length;
        getUser = task.taskActions[length - 1].creator;

        accEmployees = task.accountableEmployees.map(o => o._id);
    }

    // Danh sách người phê duyệt được gửi mail
    let userEmail = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accEmployees } });
    let email = userEmail.map(item => item.email);
    return { taskActions: task.taskActions, tasks: task, userCreator: getUser, email: email };
}
/**
 * Sửa hoạt động của cộng việc
 */
exports.editTaskAction = async (portal, params, body, files) => {
    let action = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $set: {
                "taskActions.$.description": body.description,
            },
        }
    );
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $push: {
                "taskActions.$.files": files,
            },
        }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskActions._id": params.actionId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskActions;
};

/**
 * Xóa hoạt động của công việc
 */
exports.deleteTaskAction = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $pull: {
                taskActions: { _id: params.actionId },
            },
        },
        { safe: true }
    );
    //xoa file sau khi xoa hoat dong
    let i;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar",
            },
        ]);

    return task.taskActions;
};

/**
 * Tạo bình luận công việc
 */
exports.createTaskComment = async (portal, params, body, files, user) => {
    const commentInformation = {
        creator: body.creator,
        description: body.description,
        files: files,
    };
    const taskComment = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
        params.taskId,
        {
            $push: {
                taskComments: commentInformation,
            },
        }, { new: true })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            { path: "requestToCloseTask.requestedBy", select: "name email _id active" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);

    const resEmployees = taskComment.responsibleEmployees && taskComment.responsibleEmployees.map(o => o._id);
    const accEmployees = taskComment.accountableEmployees && taskComment.accountableEmployees.map(o => o._id);
    
    const userReceive = [...resEmployees, ...accEmployees].filter(obj => JSON.stringify(obj) !== JSON.stringify(user._id))
    const associatedData = {
        dataType: "realtime_tasks",
        value: taskComment
    }

    const data = {
        organizationalUnits: taskComment.organizationalUnit && taskComment.organizationalUnit._id,
        title: "Cập nhật thông tin công việc ",
        level: "general",
        content: `<p><strong>${user.name}</strong> đã thêm một bình luận trong công việc: <a href="${process.env.WEBSITE}/task?taskId=${params.taskId}">${process.env.WEBSITE}/task?taskId=${params.taskId}</a></p>`,
        sender: `${user.name} (${taskComment.organizationalUnit.name})`,
        users: userReceive,
        associatedData: associatedData,
        associatedDataObject: {
            dataType: 1,
            description: `<p><strong>${taskComment.name}:</strong> ${user.name} đã thêm một bình luận mới trong mục trao đổi.</p>`
        }
    };

    if (userReceive && userReceive.length > 0)
        NotificationServices.createNotification(portal, user.company._id, data)
    return taskComment.taskComments;
};
/**
 * Sửa bình luận công việc
 */
exports.editTaskComment = async (portal, params, body, files) => {
    let now = new Date();
    let taskComment = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskComments._id": params.commentId },
        {
            $set: {
                "taskComments.$.description": body.description,
                "taskComments.$.updatedAt": now,
            },
        }
    );
    let taskcomment2 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskComments._id": params.commentId },
        {
            $push: {
                "taskComments.$.files": files,
            },
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskComments._id": params.commentId })
        .populate([
            { path: "taskComments.creator", select: "name email avatar " },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskComments;
};
/**
 * Xóa bình luận công việc
 */
exports.deleteTaskComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);

    //xoa files
    let i;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let comment = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskComments._id": params.commentId },
        { $pull: { taskComments: { _id: params.commentId } } },
        { safe: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "taskComments.creator", select: "name email avatar " },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar ",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskComments;
};
/**
 * Thêm bình luận của bình luận công việc
 */
exports.createCommentOfTaskComment = async (portal, params, body, files, user) => {
    const taskcomment = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { _id: params.taskId, "taskComments._id": params.commentId },
        {
            $push: {
                "taskComments.$.comments": {
                    creator: body.creator,
                    description: body.description,
                    files: files,
                },
            },
        }, { new: true })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            { path: "requestToCloseTask.requestedBy", select: "name email _id active" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);

    const { taskComments } = taskcomment;
    // Lấy ra bình luận cha
    let getTaskComment = [];
    const taskCommentLength = taskComments.length;
    for (let i = 0; i < taskCommentLength; i++) {
        if (JSON.stringify(taskComments[i]._id) === JSON.stringify(params.commentId)) {
            getTaskComment = [taskComments[i]];
            break; // Tìm thấy thì dừng vòng lặp luôn
        }
    }

    // Lấy danh sách user dự tính gửi thông báo
    let userReceive = [getTaskComment[0].creator._id];

    // Lấy người liên quan đến trong subcomment
    const subCommentLength = getTaskComment[0].comments.length;

    for (let index = 0; index < subCommentLength; index++) {
        userReceive = [...userReceive, getTaskComment[0].comments[index].creator._id];
    }

    // Loại bỏ người gửi sub comment ra khỏi danh sách user dc nhận thông báo 
    userReceive = userReceive.filter(obj => obj.toString() !== user._id.toString())

    const associatedData = {
        dataType: "realtime_tasks",
        value: taskcomment
    }
    const data = {
        organizationalUnits: taskcomment.organizationalUnit && taskcomment.organizationalUnit._id,
        title: "Cập nhật thông tin công việc ",
        level: "general",
        content: `<p><strong>${user.name}</strong> đã trả lời bình luận của bạn trong công việc: <a href="${process.env.WEBSITE}/task?taskId=${params.taskId}">${process.env.WEBSITE}/task?taskId=${params.taskId}</a></p>`,
        sender: `${user.name}`,
        users: userReceive,
        associatedData: associatedData,
        associatedDataObject: {
            dataType: 1,
            description: `<p><strong>${taskcomment.name}:</strong> ${user.name} đã trả lời bình luận của bạn trong mục trao đổi.</p>`
        }
    };
    if (userReceive && userReceive.length > 0)
        NotificationServices.createNotification(portal, user.company._id, data)
    return taskComments;
};
/**
 * Sửa bình luận của bình luận công việc
 */
exports.editCommentOfTaskComment = async (portal, params, body, files) => {
    const now = new Date();
    let comment = await Task(connect(DB_CONNECTION, portal)).updateOne(
        //thieu 1 tham so child comment
        { _id: params.taskId, "taskComments.comments._id": params.commentId },
        {
            $set: {
                "taskComments.$.comments.$[elem].description": body.description,
                "taskComments.$.comments.$[elem].updatedAt": now,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.commentId,
                },
            ],
        }
    );
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskComments.comments._id": params.commentId },
        {
            $push: {
                "taskComments.$.comments.$[elem].files": files,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.commentId,
                },
            ],
        }
    );

    let taskComment = await Task(connect(DB_CONNECTION, portal))
        .findOne({
            _id: params.taskId,
            "taskComments.comments._id": params.commentId,
        })
        .populate([
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ])
        .select("taskComments");
    return taskComment.taskComments;
};
/**
 * Xóa bình luận của bình luận coogn việc
 */
exports.deleteCommentOfTaskComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        {
            $match: {
                "comments._id": mongoose.Types.ObjectId(params.commentId),
            },
        },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);
    let comment = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskComments.comments._id": params.commentId },
        {
            $pull: {
                "taskComments.$.comments": { _id: params.commentId },
            },
        },
        { safe: true }
    );

    //xoa file sau khi xoa binh luan
    let i = 0;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let taskComment = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ])
        .select("taskComments");

    return taskComment.taskComments;
};
/**
 * Đánh giá hoạt động
 */
exports.evaluationAction = async (portal, params, body) => {
    // Kiểm tra xem đánh giá hoạt động đã tồn tại hay chưa - nếu chưa tạo mới, nếu có ghi đè
    let danhgia = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$evaluations" },
        { $replaceRoot: { newRoot: "$evaluations" } },
        {
            $match: {
                creator: mongoose.Types.ObjectId(body.creator),
                role: body.role
            }
        }
    ]);

    if (danhgia.length === 0) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: params.taskId, "taskActions._id": params.actionId },
            {
                $push: {
                    "taskActions.$.evaluations": {
                        creator: body.creator,
                        rating: body.rating,
                        role: body.role
                    },
                },
            }
        );
    } else {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: params.taskId,
                "taskActions._id": params.actionId,
                "taskActions.evaluations.creator": body.creator,
                "taskActions.evaluations.role": body.role
            }, {
            $set: {
                "taskActions.$[item].evaluations.$[elem].rating": body.rating
            }
        }, {
            arrayFilters: [
                { "elem.creator": body.creator, "elem.role": body.role },
                { "item._id": params.actionId }
            ]
        }
        )
    }

    // Lấy danh sách các đánh giá của hoạt động
    let evaluations = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$evaluations" },
        { $replaceRoot: { newRoot: "$evaluations" } },
    ]);

    //Lấy điểm đánh giá của người phê duyệt trong danh sách các danh sách các đánh giá của hoạt động
    let rating = [];
    for (let i = 0; i < evaluations.length; i++) {
        let evaluation = evaluations[i];
        if (evaluation.role === 'accountable') rating.push(evaluation.rating);
    }

    //tính điểm trung bình
    let accountableRating;
    if (rating.length > 0) {
        accountableRating =
            rating.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0) / rating.length;
    }

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $set: {
                "taskActions.$.rating": accountableRating,
            },
        },
        { $new: true }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskActions._id": params.actionId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);

    return task.taskActions;
};

exports.evaluationAllAction = async (portal, params, body, userId) => {
    const { taskId } = params;
    const taskActionLength = body.length;

    for (let i = 0; i < taskActionLength; i++) {
        // Kiểm tra xem đánh giá hoạt động đã tồn tại hay chưa - nếu chưa tạo mới, nếu có ghi đè
        let danhgia = await Task(connect(DB_CONNECTION, portal)).aggregate([
            { $match: { _id: mongoose.Types.ObjectId(taskId) } },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { _id: mongoose.Types.ObjectId(body[i].actionId) } },
            { $unwind: "$evaluations" },
            { $replaceRoot: { newRoot: "$evaluations" } },
            {
                $match: {
                    creator: mongoose.Types.ObjectId(userId),
                    role: body[i].role
                }
            }
        ]);

        if (danhgia.length === 0) {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                { _id: taskId, "taskActions._id": body[i].actionId },
                {
                    $push: {
                        "taskActions.$.evaluations": {
                            creator: userId,
                            rating: body[i].rating,
                            role: body[i].role
                        },
                    },
                }
            );
        } else {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "taskActions._id": body[i].actionId,
                    "taskActions.evaluations.creator": userId,
                    "taskActions.evaluations.role": body[i].role
                }, {
                $set: {
                    "taskActions.$[item].evaluations.$[elem].rating": body[i].rating
                }
            }, {
                arrayFilters: [
                    { "elem.creator": userId, "elem.role": body[i].role },
                    { "item._id": body[i].actionId }
                ]
            }
            )
        }

        // Lấy danh sách các đánh giá của hoạt động
        let evaluations = await Task(connect(DB_CONNECTION, portal)).aggregate([
            { $match: { _id: mongoose.Types.ObjectId(taskId) } },
            { $unwind: "$taskActions" },
            { $replaceRoot: { newRoot: "$taskActions" } },
            { $match: { _id: mongoose.Types.ObjectId(body[i].actionId) } },
            { $unwind: "$evaluations" },
            { $replaceRoot: { newRoot: "$evaluations" } },
        ]);

        //Lấy điểm đánh giá của người phê duyệt trong danh sách các danh sách các đánh giá của hoạt động
        let rating = [];
        for (let i = 0; i < evaluations.length; i++) {
            let evaluation = evaluations[i];
            if (evaluation.role === 'accountable') rating.push(evaluation.rating);
        }

        //tính điểm trung bình
        let accountableRating;
        if (rating.length > 0) {
            accountableRating =
                rating.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0) / rating.length;
        }

        // Cập nhật điểm đánh giá trung bình của người phê duyệt của hành động
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId, "taskActions._id": body[i].actionId },
            {
                $set: {
                    "taskActions.$.rating": accountableRating,
                },
            }, { $new: true }
        );
    }

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: taskId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskActions;
}

/**
 * Xác nhận hành động
 */
exports.confirmAction = async (portal, params, body) => {
    let evaluationActionRating = await Task(
        connect(DB_CONNECTION, portal)
    ).updateOne(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $set: {
                "taskActions.$.creator": body.userId,
                "taskActions.$.createdAt": Date.now(),
            },
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskActions._id": params.actionId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar " },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskActions;
};
/**
 * Upload tài liệu cho cộng việc
 */
exports.uploadFile = async (portal, params, body, files) => {
    let files1 = {
        files: files,
        creator: body.creator,
        description: body.description,
    };
    let task1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId },
        {
            $push: {
                documents: files1,
            },
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([{ path: "documents.creator", select: "name email avatar" }]);

    return task.documents;
};

/**
 * Thêm nhật ký cho một công việc
 */
exports.addTaskLog = async (portal, taskId, body) => {
    let { creator, title, description, createdAt } = body;

    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: description,
    };

    await Task(connect(DB_CONNECTION, portal))
        .updateOne(
            { '_id': taskId },
            { $push: { logs: log } },
            { new: true }
        )
        .populate({ path: "logs.creator", select: "_id name emmail avatar"});

    let taskLog = await this.getTaskLog(portal, taskId);

    return taskLog;
};

// convert ISODate to String hh:mm AM/PM
formatTime = (date) => {
    let time = moment(date).format("HH:mm DD/MM/YYYY");
    return time;
}

/** Tiện ích tạo mô tả lịch sử thay đổi công việc */
exports.createDescriptionEvaluationTaskLogs = async (portal, userId, newTask, oldTask) => {
    const { startDate, endDate, progress, status, 
        results, kpi, unit, evaluatingMonth, role, employeePoint
    } = newTask;
    let descriptionLog = '';
    let evaluatingMonthTemp = evaluatingMonth && new Date(evaluatingMonth.slice(6) + "-" + evaluatingMonth.slice(3, 5));
    const evaluateTask = oldTask?.evaluations?.filter(item => {
        let evaluatingMonthEva = new Date(item?.evaluatingMonth);
        return evaluatingMonthEva.getMonth() === evaluatingMonthTemp.getMonth();
    })[0];

    if (unit && unit !== oldTask?.organizationalUnit?._id.toString()) {
        descriptionLog = descriptionLog + '<span>Đơn vị mới: ' + oldTask?.organizationalUnit?.name + ".</span></br>";
    }
    if (status && status?.[0] !== oldTask?.status) {
        descriptionLog = descriptionLog + '<span>Trạng thái công việc mới: ' + status + ".</span></br>";
    }
    if (progress && progress !== evaluateTask?.progress) {
        descriptionLog = descriptionLog + '<span>Mức độ hoàn thành công việc mới: ' + progress + "%" + ".</span></br>";
    }
    if (startDate && (new Date(startDate)).getTime() !== evaluateTask?.startDate.getTime()) {
        descriptionLog = descriptionLog + '<span>Ngày bắt đầu mới: ' + formatTime(startDate) + ".</span></br>";
    }
    if (endDate && (new Date(endDate)).getTime() !== evaluateTask?.endDate.getTime()) {
        descriptionLog = descriptionLog + '<span>Ngày kết thúc mới: ' + formatTime(endDate) + ".</span></br>";
    }

    let resultEvaluation = evaluateTask?.results?.filter(item => item?.employee?._id.toString() === userId && item?.role === role.toString())?.[0];
    if (employeePoint && employeePoint !== resultEvaluation?.employeePoint) {
        descriptionLog = descriptionLog + '<span>Điểm tự đánh giá mới: ' + employeePoint + ".</span></br>";
    }

    if (kpi?.length !== resultEvaluation?.kpis?.length) {
        if (kpi?.length > 0) {
            let dataKpi = await EmployeeKpi(connect(DB_CONNECTION, portal)).find({
                '_id': { $in: kpi.map(item => mongoose.Types.ObjectId(item)) }
            })
            if (dataKpi?.length > 0) {
                let nameKpi = "";
                dataKpi?.map((item, index) => {
                    nameKpi = nameKpi + item?.name + (index < kpi?.length - 1 ? ", " : "");
                })
                descriptionLog = descriptionLog + '<span>Tập KPI liên kết công việc mới: ' + nameKpi + ".</span></br>";
            }
        } else {
            descriptionLog = descriptionLog + '<span>Các KPI liên kết công việc đã bị xóa' + ".</span></br>";
        }
    }

    if (results) {
        let result = Object.values(results)
        if (evaluateTask?.results?.length > 0) {
            evaluateTask.results.map(eva => {
                let temp = result?.filter(item => item?.role === eva?.role);
                if (temp?.length > 0) {
                    temp.map(item => {
                        if (item?.target === "Point" && item?.value !== eva?.approvedPoint) {
                            descriptionLog = descriptionLog + '<span>Điểm phê duyệt mới của ' + eva?.employee?.name 
                                    + " với vai trò " + eva?.role + " là: " + item?.value + ".</span></br>";
                        } 
                        else if (item?.target === "Contribution" && item?.value !== eva?.contribution) {
                            descriptionLog = descriptionLog + '<span>Phần trăm đóng góp mới của ' + eva?.employee?.name 
                                    + " với vai trò " + eva?.role + " là: " + item?.value + ".</span></br>";
                        }
                    })
                }
            })
        }
    }

    return descriptionLog;
}

/**
 * Lấy tất cả nhật ký của một công việc
 */
exports.getTaskLog = async (portal, taskId) => {
    let task = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate("logs.creator");

    return task.logs.reverse();
};

/**
 * hàm convert dateISO sang string
 */
formatDate = (date) => {
    let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
};

/**
 * hàm check điều kiện evaluate tồn tại
 */
async function checkEvaluations(portal, date, taskId, storeDate) {
    let evaluateId;
    let splitterStoreDate = storeDate.split("-");
    let storeDateISO = new Date(
        splitterStoreDate[2],
        splitterStoreDate[1] - 1,
        splitterStoreDate[0]
    );

    let splitterDate = date.split("-");
    let dateISO = new Date(
        splitterDate[2],
        splitterDate[1] - 1,
        splitterDate[0]
    );
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let testCase;

    // kiểm tra evaluations
    let initTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    let cloneTaskInfo = [];
    for (let i in initTask.taskInformations) {
        cloneTaskInfo[i] = {
            _id: initTask.taskInformations[i]._id,
            name: initTask.taskInformations[i].name,
            code: initTask.taskInformations[i].code,
            type: initTask.taskInformations[i].type,
            extra: initTask.taskInformations[i].extra,
            filledByAccountableEmployeesOnly:
                initTask.taskInformations[i].filledByAccountableEmployeesOnly,
        };
    }

    // kiểm tra điều kiện của evaluations
    if (initTask.evaluations.length === 0) {
        testCase = "TH1";
    } else {
        let chk = initTask.evaluations.find(
            (e) =>
                monthOfParams === e.evaluatingMonth.getMonth() &&
                yearOfParams === e.evaluatingMonth.getFullYear()
        );
        if (!chk) {
            // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else {
            // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }

    // TH1: chưa có evaluations => tạo mới
    if (testCase === "TH1") {
        let evaluationsVer1 = {
            evaluatingMonth: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo,
        };
        let taskV1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer1,
                },
            },
            {
                $new: true,
            }
        );
        let taskV2 = await Task(connect(DB_CONNECTION, portal)).findById(
            taskId
        );
        evaluateId = taskV2.evaluations[0]._id;
    }

    // TH2: Có evaluation nhưng chưa có tháng giống với evaluatingMonth => tạo mới
    else if (testCase === "TH2") {
        let evaluationsVer2 = {
            evaluatingMonth: storeDateISO,
            kpi: [],
            result: [],
            taskInformations: cloneTaskInfo,
        };
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId },
            {
                $push: {
                    evaluations: evaluationsVer2,
                },
            },
            {
                $new: true,
            }
        );

        let taskV2 = await Task(connect(DB_CONNECTION, portal)).findById(
            taskId
        );
        evaluateId = taskV2.evaluations.find(
            (e) =>
                monthOfParams === e.evaluatingMonth.getMonth() &&
                yearOfParams === e.evaluatingMonth.getFullYear()
        )._id;
    }

    // TH3: Có evaluations của tháng giống evaluatingMonth => cập nhật evaluations
    else if (testCase === "TH3") {
        let taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(
            (e) =>
                monthOfParams === e.evaluatingMonth.getMonth() &&
                yearOfParams === e.evaluatingMonth.getFullYear()
        )._id;
    }

    return evaluateId;
}

exports.getIdEvaluationOfThisMonth = async (portal, taskId) => {
    let evaluateId;
    let dateISO = new Date();
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let testCase;

    // kiểm tra evaluations
    let initTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // kiểm tra điều kiện của evaluations
    if (initTask.evaluations.length === 0) {
        testCase = "TH1";
    } else {
        let chk = initTask.evaluations.find(
            (e) =>
                monthOfParams === e.evaluatingMonth && e.evaluatingMonth.getMonth() &&
                yearOfParams === e.evaluatingMonth && e.evaluatingMonth.getFullYear()
        );
        if (!chk) {
            // có evaluate nhưng k có tháng này
            testCase = "TH2";
        } else {
            // có evaluate đúng tháng này
            testCase = "TH3";
        }
    }

    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    if (testCase === "TH3") {
        let taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(
            (e) =>
                monthOfParams === e.evaluatingMonth.getMonth() &&
                yearOfParams === e.evaluatingMonth.getFullYear()
        )._id;
    }

    return evaluateId;
}


/**
 * edit task by responsible employee
 */
exports.editTaskByResponsibleEmployees = async (portal, data, taskId) => {
    let { name, description, kpi, user, progress, info, date, listInfo, taskProject } = data;
    let evaluateId;

    let listInfoTask = [];
    if (listInfo) {
        listInfoTask = listInfo;
    }

    const endOfMonth = moment().endOf("month").format("DD-MM-YYYY");

    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) {
            // !== undefined
            if (info[i].type === "number")
                info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values")
                info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(
                    splitter[2],
                    splitter[1] - 1,
                    splitter[0]
                );
                info[i].value = infoDate;
            }
        }
    }

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress,
                taskProject: taskProject,
            },
        },
        { $new: true }
    );

    // cập nhật giá trị info
    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly:
                        task.taskInformations[i]
                            .filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value,
                    isOutput: task?.taskInformations?.[i]?.isOutput
                };

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task?.taskInformations?.[i]?._id,
                    },
                    {
                        $set: {
                            "taskInformations.$.value":
                                task?.taskInformations?.[i]?.value,
                        },
                    },
                    {
                        $new: true,
                    }
                );
            }
        }
    }

    // let newTask = await this.getTask(taskId).info;
    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);

    //xu ly gui email
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let userId = tasks.accountableEmployees;
    let user1 = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userId },
    });
    let email = user1.map((item) => item.email);
    user = await User(connect(DB_CONNECTION, portal)).findById(data.user);
    newTask.evaluations.reverse();

    return { newTask: newTask, email: email, user: user, tasks: tasks };
};

/**
 * edit task by responsible employee
 * @param {Object} data dữ liệu cần chỉnh sửa
 * @param {String} taskID id của công việc cần edit
 */
exports.editTaskByAccountableEmployees = async (portal, data, taskId) => {
    let {
        description,
        name,
        priority,
        status,
        formula,
        parent,
        startDate,
        endDate,
        progress,
        info,
        date,
        accountableEmployees,
        consultedEmployees,
        responsibleEmployees,
        informedEmployees,
        inactiveEmployees,
        collaboratedWithOrganizationalUnits,
        listInfo,
        taskProject,
    } = data;

    // Chuẩn hóa parent
    if (parent === "") {
        parent = null;
    }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) {
            // !== undefined
            if (info[i].type === "number")
                info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values")
                info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(
                    splitter[2],
                    splitter[1] - 1,
                    splitter[0]
                );
                info[i].value = infoDate;
            }
        }
    }

    let taskItem = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // update collaboratedWithOrganizationalUnits
    let newCollab = [];
    let oldCollab = taskItem.collaboratedWithOrganizationalUnits.map(e => { return e.organizationalUnit });
    for (let i in collaboratedWithOrganizationalUnits) {
        let elem = collaboratedWithOrganizationalUnits[i];

        let checkCollab = taskItem.collaboratedWithOrganizationalUnits.find(e => String(e.organizationalUnit) === String(elem));

        if (checkCollab) {
            newCollab.push({
                organizationalUnit: elem,
                isAssigned: checkCollab.isAssigned,
            })
        } else {
            newCollab.push({
                organizationalUnit: elem,
                isAssigned: false,
            })
        }
    }

    // cập nhật thông tin cơ bản
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        {
            $set: {
                name: name,
                description: description,
                progress: progress,
                priority: parseInt(priority[0]),
                status: status[0],
                formula: formula,
                parent: parent,
                taskProject: taskProject,

                startDate: new Date(startDate),
                endDate: new Date(endDate),

                collaboratedWithOrganizationalUnits: newCollab,

                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees,
                accountableEmployees: accountableEmployees,
                informedEmployees: informedEmployees,

                inactiveEmployees: inactiveEmployees,
            },
        },
        { $new: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // list info
    let listInfoTask = [];
    if (listInfo) {
        listInfoTask = listInfo;
    }
    let evaluateId;
    let listChangeTypeInfo = [];


    evaluateId = await this.getIdEvaluationOfThisMonth(portal, taskId);

    // tìm ra info ở thông tin chung bị xóa
    let deletedInfoItems = task.taskInformations.filter(x =>
        listInfoTask.find(e => String(e._id) === String(x._id)) === undefined // không tìm được phần tử nào có id giống với x._id, tức là x là deleted info 
    ).map(el => el._id);

    let evaluation = task.evaluations.find(e => String(e._id) === String(evaluateId));


    if (listInfoTask && listInfoTask.length > 0) {
        // xóa info ở thông tin chung
        for (let i in deletedInfoItems) {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "taskInformations._id": deletedInfoItems[i]
                },
                {
                    $pull: {
                        "taskInformations": { _id: deletedInfoItems[i] },
                    },
                },
                { safe: true }
            );
        }

        // Xóa info ở đánh giá tháng hiện tại
        for (let i in deletedInfoItems) {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,
                    "evaluations.taskInformations._id": deletedInfoItems[i]
                },
                {
                    $pull: {
                        "evaluations.$.taskInformations": { _id: deletedInfoItems[i] },
                    },
                },
                { safe: true }
            );
        }
    }

    // cập nhật task infomation ở thông tin chung
    for (let i in listInfoTask) {
        if (listInfoTask[i]._id) {
            for (let x in task.taskInformations) {
                if (String(listInfoTask[i]._id) === String(task.taskInformations[x]._id)) {
                    if (listInfoTask[i].type === task.taskInformations[x].type) {
                        await Task(connect(DB_CONNECTION, portal)).updateOne(
                            {
                                _id: taskId,
                                "taskInformations._id": listInfoTask[i]._id,
                            },
                            {
                                $set: {
                                    "taskInformations.$.code": "p" + parseInt(Number(i) + 1),
                                    "taskInformations.$.name": listInfoTask[i].name,
                                    "taskInformations.$.filledByAccountableEmployeesOnly": listInfoTask[i].filledByAccountableEmployeesOnly,
                                    "taskInformations.$.description": listInfoTask[i].description,
                                    "taskInformations.$.extra": listInfoTask[i].extra,
                                    "taskInformations.$.isOutput": listInfoTask[i].isOutput
                                },
                            },
                            {
                                $new: true,
                            }
                        );
                    }
                    else {
                        listChangeTypeInfo.push(listInfoTask[i]._id);
                        await Task(connect(DB_CONNECTION, portal)).updateOne(
                            {
                                _id: taskId,
                                "taskInformations._id": listInfoTask[i]._id,
                            },
                            {
                                $set: {
                                    "taskInformations.$.code": "p" + parseInt(Number(i) + 1),
                                    "taskInformations.$.name": listInfoTask[i].name,
                                    "taskInformations.$.filledByAccountableEmployeesOnly": listInfoTask[i].filledByAccountableEmployeesOnly,
                                    "taskInformations.$.description": listInfoTask[i].description,
                                    "taskInformations.$.extra": listInfoTask[i].extra,
                                    "taskInformations.$.type": listInfoTask[i].type,
                                    "taskInformations.$.value": null,
                                    "taskInformations.$.isOutput": listInfoTask[i].isOutput
                                },
                            },
                            {
                                $new: true,
                            }
                        );
                    }

                }
            }
        }
        else {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                },
                {
                    $push: {
                        taskInformations: {
                            "code": "p" + parseInt(Number(i) + 1),
                            "name": listInfoTask[i].name,
                            "filledByAccountableEmployeesOnly": listInfoTask[i].filledByAccountableEmployeesOnly,
                            "description": listInfoTask[i].description,
                            "type": listInfoTask[i].type,
                            "extra": listInfoTask[i].extra,
                            "taskInformations.$.isOutput": listInfoTask[i].isOutput
                        }
                    }
                },
            );
        }
    }

    // cập nhật task infomation ở đánh giá tháng hiện tại
    if (evaluateId) {
        for (let i in listInfoTask) {
            if (listInfoTask[i]._id) {
                for (let x in task.taskInformations) {
                    // do các thông tin như _id, type, code,... ở trong task.taskInformations giống với evaluation.taskInformations 
                    // nên có thể dùng task.taskInformations để cập nhật thông tin của evaluation.taskInformations
                    if (String(listInfoTask[i]._id) === String(task.taskInformations[x]._id)) {
                        if (listInfoTask[i].type === task.taskInformations[x].type) {
                            await Task(connect(DB_CONNECTION, portal)).updateOne(
                                {
                                    _id: taskId,
                                    "evaluations._id": evaluateId,
                                },
                                {
                                    $set: {
                                        "evaluations.$.taskInformations.$[elem].code": "p" + parseInt(Number(i) + 1),
                                        "evaluations.$.taskInformations.$[elem].name": listInfoTask[i].name,
                                        "evaluations.$.taskInformations.$[elem].filledByAccountableEmployeesOnly": listInfoTask[i].filledByAccountableEmployeesOnly,
                                        "evaluations.$.taskInformations.$[elem].description": listInfoTask[i].description,
                                        "evaluations.$.taskInformations.$[elem].extra": listInfoTask[i].extra
                                    },
                                },
                                {
                                    arrayFilters: [
                                        {
                                            "elem._id": listInfoTask[i]._id,
                                        },
                                    ],
                                }
                            );
                        }
                        else {
                            await Task(connect(DB_CONNECTION, portal)).updateOne(
                                {
                                    _id: taskId,
                                    "evaluations._id": evaluateId,
                                },
                                {
                                    $set: {
                                        "evaluations.$.taskInformations.$[elem].code": "p" + parseInt(Number(i) + 1),
                                        "evaluations.$.taskInformations.$[elem].name": listInfoTask[i].name,
                                        "evaluations.$.taskInformations.$[elem].filledByAccountableEmployeesOnly": listInfoTask[i].filledByAccountableEmployeesOnly,
                                        "evaluations.$.taskInformations.$[elem].description": listInfoTask[i].description,
                                        "evaluations.$.taskInformations.$[elem].extra": listInfoTask[i].extra,
                                        "evaluations.$.taskInformations.$[elem].type": listInfoTask[i].type,
                                        "evaluations.$.taskInformations.$[elem].value": null
                                    },
                                },
                                {
                                    arrayFilters: [
                                        {
                                            "elem._id": listInfoTask[i]._id,
                                        },
                                    ],
                                }
                            );
                        }

                    }
                }
            }
            else {
                let updatedItem = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
                let codeOfNewItem = "p" + parseInt(Number(i) + 1);
                let newInfoItem = updatedItem.taskInformations.find(e => e.code === codeOfNewItem);
                if (newInfoItem) {
                    await Task(connect(DB_CONNECTION, portal)).updateOne(
                        {
                            _id: taskId,
                            "evaluations._id": evaluateId,
                        },
                        {
                            $push: {
                                "evaluations.$.taskInformations": newInfoItem
                            }
                        },
                    );
                }
            }
        }
    }

    task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật value cho info
    for (let item in info) {
        for (let i in task.taskInformations) {
            if (info[item].code === task.taskInformations[i].code) {
                task.taskInformations[i] = {
                    filledByAccountableEmployeesOnly:
                        task.taskInformations[i]
                            .filledByAccountableEmployeesOnly,
                    _id: task.taskInformations[i]._id,
                    code: task.taskInformations[i].code,
                    name: task.taskInformations[i].name,
                    description: task.taskInformations[i].description,
                    type: task.taskInformations[i].type,
                    extra: task.taskInformations[i].extra,
                    value: info[item].value,
                    isOutput: task.taskInformations[i].isOutput
                };
                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "taskInformations._id": task.taskInformations[i]._id,
                    },
                    {
                        $set: {
                            "taskInformations.$.value":
                                task.taskInformations[i].value,
                        },
                    },
                    {
                        $new: true,
                    }
                );
            }
        }
    }

    let deletedCollab = [];
    //  = oldCollab.map(e => String(e)).filter(item => newCollab.find(e => String(e) !== item));
    let additionalCollab = [];
    //  = newCollab.map(e => String(e.organizationalUnit)).filter(item => oldCollab.find(e => String(e) !== item));

    for (let i in oldCollab) {
        let tmp = newCollab.map(e => String(e.organizationalUnit));
        if (tmp.indexOf(String(oldCollab[i])) === -1) {
            deletedCollab.push(String(oldCollab[i]))
        }
    }
    for (let i in newCollab) {
        let tmp = oldCollab.map(e => String(e));
        if (tmp.indexOf(String(newCollab[i].organizationalUnit)) === -1) {
            additionalCollab.push(String(newCollab[i].organizationalUnit))
        }
    }

    let managersOfDeletedCollabID = [],
        managersOfAdditionalCollabID = [],
        managersOfDeletedCollab,
        managersOfAdditionalCollab,
        deletedCollabHtml, deletedCollabEmail,
        additionalCollabHtml, additionalCollabEmail;

    // Lấy id trưởng phòng các đơn vị phối hợp
    for (let i = 0; i < deletedCollab.length; i++) {
        let unit = deletedCollab[i] && await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(deletedCollab[i])

        unit && unit.managers.map(item => {
            managersOfDeletedCollabID.push(item);
        })
    }

    for (let i = 0; i < additionalCollab.length; i++) {
        let unit = additionalCollab[i] && await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(additionalCollab[i])

        unit && unit.managers.map(item => {
            managersOfAdditionalCollabID.push(item);
        })
    }

    managersOfDeletedCollab = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: managersOfDeletedCollabID }
        })
        .populate("userId")
    deletedCollabEmail = managersOfDeletedCollab.map(item => item.userId && item.userId.email) // Lấy email trưởng đơn vị phối hợp 

    managersOfAdditionalCollab = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: managersOfAdditionalCollabID }
        })
        .populate("userId")
    additionalCollabEmail = managersOfAdditionalCollab.map(item => item.userId && item.userId.email) // Lấy email trưởng đơn vị phối hợp 

    let users, userIds

    let resId = task.responsibleEmployees;  // lấy id người thực hiện
    let res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    userIds = resId;

    let accId = task.accountableEmployees;  // lấy id người phê duyệt
    let acc = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accId } });
    userIds.push(...accId);

    let conId = task.consultedEmployees;  // lấy id người tư vấn
    let con = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: conId } })
    userIds.push(...conId);

    let infId = task.informedEmployees;  // lấy id người quan sát
    let inf = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: infId } })
    userIds.push(...infId);  // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map(u => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }

    let body = `<a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank" title="${process.env.WEBSITE}/task?taskId=${task._id}"><strong>${task.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        }).join('')}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        }).join('')}
                    </ul>` +
        `${con.length > 0 ? `<p>Người tư vấn</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            }).join('')}
                    </ul>` : ""}` +
        `${inf.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            }).join('')}
                    </ul>` : ""}`
        ;

    additionalCollabHtml = `<p>Đơn vị của bạn được phối hợp thực hiện công việc mới: ` + body;
    deletedCollabHtml = `<p>Đơn vị của bạn đã bị loại khỏi các đơn vị phối hợp thực hiện của công việc: ` + body;

    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);

    //xu ly gui email
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let userId = tasks.responsibleEmployees;
    let user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userId },
    });
    let email = user.map((item) => item.email);

    user = await User(connect(DB_CONNECTION, portal)).findById(data.user);
    newTask.evaluations.reverse();

    return {
        newTask: newTask, email: email, user: user, tasks: tasks,
        deletedCollabEmail: deletedCollabEmail, deletedCollabHtml: deletedCollabHtml,
        managersOfDeletedCollab: managersOfDeletedCollab.map(item => item.userId && item.userId._id),

        additionalCollabEmail: additionalCollabEmail, additionalCollabHtml: additionalCollabHtml,
        managersOfAdditionalCollab: managersOfAdditionalCollab.map(item => item.userId && item.userId._id),
    };
}
 
/** Chỉnh sửa nhân viên tham gia công việc mà đơn vị được phối hợp */
exports.editEmployeeCollaboratedWithOrganizationalUnits = async (portal, taskId, data) => {
    let {
        responsibleEmployees,
        consultedEmployees,
        oldResponsibleEmployees,
        oldConsultedEmployees,
        unitId,
        isAssigned,
    } = data;
    let task, newEmployees = [], descriptionLogs = "";

    task = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate({ path: "collaboratedWithOrganizationalUnits.organizationalUnit" });

    // Mô tả nhật ký thay đổi
    if (task) {
        let unit = task.collaboratedWithOrganizationalUnits.filter(item => item.organizationalUnit._id.toString() === unitId);
        descriptionLogs = descriptionLogs + unit[0].organizationalUnit.name;

        if (unit[0] && unit[0].isAssigned !== isAssigned) {
            if (isAssigned) {
                descriptionLogs = descriptionLogs + " - Xác nhận phân công công việc";
            } else {
                descriptionLogs = descriptionLogs + " - Hủy xác nhận phân công công việc";
            }
        }
    }

    // Lấy nhân viên mới để gửi mail
    if (responsibleEmployees && responsibleEmployees.length !== 0) {
        responsibleEmployees.map((item) => {
            if (!task.responsibleEmployees.includes(item)) {
                newEmployees.push(item);
            }
        });
    }
    if (consultedEmployees && consultedEmployees.length !== 0) {
        consultedEmployees.map((item) => {
            if (!task.consultedEmployees.includes(item)) {
                newEmployees.push(item);
            }
        });
    }
    newEmployees = Array.from(new Set(newEmployees));

    // Xóa người thực hiện cũ của đơn vị hiện tại
    if (
        oldResponsibleEmployees &&
        oldResponsibleEmployees.length !== 0 &&
        task.responsibleEmployees
    ) {
        for (let i = task.responsibleEmployees.length - 1; i >= 0; i--) {
            if (
                oldResponsibleEmployees.includes(
                    task.responsibleEmployees[i].toString()
                )
            ) {
                task.responsibleEmployees.splice(i, 1);
            }
        }
    }
    // Xóa người hỗ trợ của đơn vị hiện tại
    if (
        oldConsultedEmployees &&
        oldConsultedEmployees.length !== 0 &&
        task.consultedEmployees
    ) {
        for (let i = task.consultedEmployees.length - 1; i >= 0; i--) {
            if (
                oldConsultedEmployees.includes(
                    task.consultedEmployees[i].toString()
                )
            ) {
                task.consultedEmployees.splice(i, 1);
            }
        }
    }

    // Thêm mới người thực hiẹn và người hỗ trợ
    task.responsibleEmployees = task.responsibleEmployees.concat(
        responsibleEmployees
    );
    task.consultedEmployees = task.consultedEmployees.concat(
        consultedEmployees
    );

    task = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: mongoose.Types.ObjectId(taskId) },
        {
            $set: {
                responsibleEmployees: task.responsibleEmployees,
                consultedEmployees: task.consultedEmployees,
            },
        },
        { $new: true }
    );

    task = await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: mongoose.Types.ObjectId(taskId),
            "collaboratedWithOrganizationalUnits.organizationalUnit": unitId,
        },
        {
            $set: {
                "collaboratedWithOrganizationalUnits.$.isAssigned": isAssigned,
            },
        },
        { $new: true }
    );

    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    let html, email;
    html =
        `<p>Bạn được phân công công việc: <a href="${process.env.WEBSITE}/task?taskId=${newTask._id}" target="_blank"><strong>${newTask.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        // `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${newTask.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${newTask.responsibleEmployees.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`;
        }).join('')}
                    </ul>` +
        `<p>Người phê duyệt</p> ` +
        `<ul>${newTask.accountableEmployees.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`;
        }).join('')}
                    </ul>` +
        `${newTask.consultedEmployees.length > 0
            ? `<p>Người tư vấn</p> ` +
            `<ul>${newTask.consultedEmployees.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`;
            }).join('')}
                    </ul>`
            : ""
        }` +
        `${newTask.informedEmployees.length > 0
            ? `<p>Người quan sát</p> ` +
            `<ul>${newTask.informedEmployees.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`;
            }).join('')}
                    </ul>`
            : ""
        }`;

    if (newEmployees && newEmployees.length !== 0) {
        newEmployees = await User(connect(DB_CONNECTION, portal)).find({
            _id: { $in: newEmployees.map(item => mongoose.Types.ObjectId(item)) },
        });
        email = newEmployees.map((item) => item.email);
    }




    // Update nhật ký chỉnh sửa
    if (newEmployees && newEmployees.length !== 0) {
        descriptionLogs = descriptionLogs + " - Thêm mới nhân viên tham gia công việc: ";
        newEmployees.map((item, index) => {
            descriptionLogs = descriptionLogs + (index > 0 ? ", " : "") + item.name;
        });
    } else {
        descriptionLogs = descriptionLogs + " - Không nhân viên nào được thêm mới"
    }

    return {
        task: newTask,
        html: html,
        email: email,
        newEmployees: newEmployees.map((item) => item._id),
        descriptionLogs: descriptionLogs
    };
};

/**
 * evaluate task by consulted
 */
exports.evaluateTaskByConsultedEmployees = async (portal, data, taskId) => {
    let user = data.user;
    let { automaticPoint, employeePoint, kpi, unit, role, evaluatingMonth, startDate, endDate } = data;
    let evaluateId = await checkEvaluations(portal, evaluatingMonth, taskId, evaluatingMonth);

    let splitter = evaluatingMonth.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let startEval = new Date(startDate);

    let endEval = new Date(endDate);

    let resultItem = {
        employee: user,
        employeePoint: employeePoint,
        organizationalUnit: unit,
        kpis: kpi,
        automaticPoint: automaticPoint,
        role: role,
    };
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result

    let listResult = task.evaluations.find(
        (e) => String(e._id) === String(evaluateId)
    ).results;

    let check_results = listResult.find(
        (r) => String(r.employee) === user && String(r.role) === "consulted"
    );
    if (check_results === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,
            },
            {
                $push: {
                    "evaluations.$.results": resultItem,
                },
            },
            { $new: true }
        );
    } else {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
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
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role,
                    },
                ],
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint,
            },
        }
    );

    // cập nhật lại ngày đánh giá
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.evaluatingMonth": dateFormat,
                "evaluations.$.startDate": startEval,
                "evaluations.$.endDate": endEval,
            },
        },
        {
            $new: true,
        }
    );

    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/**
 * evaluate task by Responsible
 */
exports.evaluateTaskByResponsibleEmployees = async (portal, data, taskId) => {
    let {
        user,
        unit,
        checkSave,
        progress,
        automaticPoint,
        employeePoint,
        role,
        evaluatingMonth,
        startDate,
        endDate,
        kpi,
        info,
    } = data;

    let splitter = evaluatingMonth.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let startEval = new Date(startDate);

    let endEval = new Date(endDate);

    let resultItem = {
        employee: user,
        organizationalUnit: unit,
        kpis: kpi,
        employeePoint: employeePoint,
        automaticPoint: automaticPoint,
        role: role,
    };

    let evaluateId = await checkEvaluations(portal, evaluatingMonth, taskId, evaluatingMonth);

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) {
            if (info[i].type === "number")
                info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values")
                info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(
                    splitter[2],
                    splitter[1] - 1,
                    splitter[0]
                );
                info[i].value = infoDate;
            }
        }
    }

    checkSave &&
        (await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId },
            { $set: { progress: progress } },
            { $new: true }
        ));

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            },
        },
        {
            $new: true,
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    let listResult = task.evaluations.find(
        (e) => String(e._id) === String(evaluateId)
    ).results;

    let check_results = listResult.find(
        (r) => String(r.employee) === user && String(r.role) === "responsible"
    );
    if (check_results === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,
            },
            {
                $push: {
                    "evaluations.$.results": resultItem,
                },
            },
            { $new: true }
        );
    } else {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
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
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": role,
                    },
                ],
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint,
            },
        }
    );

    // update Info task
    let dateISO = new Date(endDate)
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly:
                        cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value,
                };
                // quangdz
                if (
                    yearOfParams > now.getFullYear() ||
                    (yearOfParams <= now.getFullYear() &&
                        monthOfParams >= now.getMonth())
                ) {
                    checkSave &&
                        (await Task(connect(DB_CONNECTION, portal)).updateOne(
                            {
                                _id: taskId,
                                "taskInformations._id": cloneInfo[i]._id,
                            },
                            {
                                $set: {
                                    "taskInformations.$.value":
                                        cloneInfo[i].value,
                                },
                            },
                            {
                                $new: true,
                            }
                        ));
                }

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId,
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value":
                                cloneInfo[i].value,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id,
                            },
                        ],
                    }
                );
            }
        }
    }

    // update date of evaluation

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.evaluatingMonth": dateFormat,
                "evaluations.$.startDate": startEval,
                "evaluations.$.endDate": endEval,
            },
        },
        {
            $new: true,
        }
    );

    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/**
 * evaluate task by Accountable
 */
exports.evaluateTaskByAccountableEmployees = async (portal, data, taskId) => {
    let {
        unit,
        user,
        hasAccountable,
        checkSave,
        progress,
        evaluatingMonth,
        startDate,
        endDate,
        status,
        info,
        results,
        kpi,
    } = data;

    let automaticPoint =
        data.automaticPoint === undefined ? 0 : data.automaticPoint;

    let splitter = evaluatingMonth.split("-");
    let evaluateDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let dateFormat = evaluateDate;

    let startEval = new Date(startDate);

    let endEval = new Date(endDate);

    let evaluateId = await checkEvaluations(portal, evaluatingMonth, taskId, evaluatingMonth);

    // lấy info có value khác undefined
    let filterInfo = [];
    for (let i in info) {
        if (info[i].value !== undefined) {
            filterInfo.push(info[i]);
        }
    }

    // chuẩn hóa dữ liệu info
    for (let i in info) {
        if (info[i].value) {
            // !== undefined
            if (info[i].type === "number")
                info[i].value = parseInt(info[i].value);
            else if (info[i].type === "set_of_values")
                info[i].value = info[i].value[0];
            else if (info[i].type === "date") {
                let splitter = info[i].value.split("-");
                let infoDate = new Date(
                    splitter[2],
                    splitter[1] - 1,
                    splitter[0]
                );
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
                if (
                    results[i].employee === results[j].employee &&
                    results[i].role === results[j].role
                ) {
                    let point, contribute;

                    // do i hoặc j có thể là point hoặc contribute nên phải kiểm tra cả 2 để tính đc point và contribute
                    if (String(results[i].target) === "Point")
                        point = results[i].value;
                    else if (String(results[i].target) === "Contribution")
                        contribute = results[i].value;

                    if (String(results[j].target) === "Point")
                        point = results[j].value;
                    else if (String(results[j].target) === "Contribution")
                        contribute = results[j].value;

                    let cloneItem = {
                        employee: results[i].employee,
                        role: results[i].role,
                        point: point,
                        contribute: contribute,
                    };
                    if (point !== undefined || contribute !== undefined) {
                        cloneResult.push(cloneItem);
                    }
                }
            }
        }
    }

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        { $set: { status: status[0] } }
    );
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    checkSave &&
        (await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId },
            { $set: { progress: progress } }
        ));
    task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result (==============BEGIN============)

    let listResult = task.evaluations.find(
        (e) => String(e._id) === String(evaluateId)
    ).results;

    // TH có điền thông tin result
    for (let item in cloneResult) {
        let check_data = listResult.find(
            (r) =>
                String(r.employee) === cloneResult[item].employee &&
                r.role === cloneResult[item].role
        );
        // TH nguoi nay da danh gia ket qua --> thi chi can cap nhat lai ket qua thoi
        if (check_data !== undefined) {
            // cap nhat diem
            await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "evaluations._id": evaluateId,
                },
                {
                    $set: {
                        "evaluations.$.results.$[elem].approvedPoint":
                            cloneResult[item].point,
                        "evaluations.$.results.$[elem].contribution":
                            cloneResult[item].contribute,
                    },
                },
                {
                    arrayFilters: [
                        {
                            "elem.employee": cloneResult[item].employee,
                            "elem.role": cloneResult[item].role,
                        },
                    ],
                }
            );
        } else {
            await Task(connect(DB_CONNECTION, portal)).updateOne(
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
                            employeePoint: 0,
                        },
                    },
                },
                {
                    $new: true,
                }
            );
        }
    }

    let task2 = await Task(connect(DB_CONNECTION, portal)).findById(taskId);

    // cập nhật thông tin result cho cá nhân người phê duyệt

    let listResult2 = task2.evaluations.find(
        (e) => String(e._id) === String(evaluateId)
    ).results;

    let curentRole = "accountable";
    if (!hasAccountable) {
        curentRole = "responsible";
    }

    // cập nhật điểm cá nhân cho ng phe duyet
    let check_approve = listResult2.find(
        (r) => String(r.employee) === user && String(r.role) === curentRole
    );
    if (cloneResult.length > 0) {
        for (let i in cloneResult) {
            if (
                String(cloneResult[i].role) === curentRole &&
                String(cloneResult[i].employee) === String(user)
            ) {
                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId,
                    },
                    {
                        $set: {
                            "evaluations.$.results.$[elem].employeePoint":
                                cloneResult[i].point,
                            "evaluations.$.results.$[elem].organizationalUnit": unit,
                            "evaluations.$.results.$[elem].kpis": kpi,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "elem.employee": cloneResult[i].employee,
                                "elem.role": cloneResult[i].role,
                            },
                        ],
                    }
                );
            }
        }
    } else if (check_approve === undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,
            },
            {
                $push: {
                    "evaluations.$.results": {
                        organizationalUnit: unit,
                        kpis: kpi,
                        employee: user,
                        role: curentRole,
                    },
                },
            },
            { $new: true }
        );
    } else if (check_approve !== undefined) {
        await Task(connect(DB_CONNECTION, portal)).updateOne(
            {
                _id: taskId,
                "evaluations._id": evaluateId,
            },
            {
                $set: {
                    "evaluations.$.results.$[elem].organizationalUnit": unit,
                    "evaluations.$.results.$[elem].kpis": kpi,
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.employee": user,
                        "elem.role": curentRole,
                    },
                ],
            }
        );
    }

    //cập nhật lại tất cả điểm tự động
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.results.$[].automaticPoint": automaticPoint,
            },
        }
    );

    // update Info task
    let dateISO = new Date(endDate)
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();
    let now = new Date();

    let cloneInfo = task.taskInformations;
    for (let item in info) {
        for (let i in cloneInfo) {
            if (info[item].code === cloneInfo[i].code) {
                cloneInfo[i] = {
                    filledByAccountableEmployeesOnly:
                        cloneInfo[i].filledByAccountableEmployeesOnly,
                    _id: cloneInfo[i]._id,
                    code: cloneInfo[i].code,
                    name: cloneInfo[i].name,
                    description: cloneInfo[i].description,
                    type: cloneInfo[i].type,
                    extra: cloneInfo[i].extra,
                    value: info[item].value,
                };
                //quangdz
                if (
                    yearOfParams > now.getFullYear() ||
                    (yearOfParams <= now.getFullYear() &&
                        monthOfParams >= now.getMonth())
                ) {
                    checkSave &&
                        (await Task(connect(DB_CONNECTION, portal)).updateOne(
                            {
                                _id: taskId,
                                "taskInformations._id": cloneInfo[i]._id,
                            },
                            {
                                $set: {
                                    "taskInformations.$.value":
                                        cloneInfo[i].value,
                                },
                            },
                            {
                                $new: true,
                            }
                        ));
                }

                await Task(connect(DB_CONNECTION, portal)).updateOne(
                    {
                        _id: taskId,
                        "evaluations._id": evaluateId,
                    },
                    {
                        $set: {
                            "evaluations.$.taskInformations.$[elem].value":
                                cloneInfo[i].value,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "elem._id": cloneInfo[i]._id,
                            },
                        ],
                    }
                );
            }
        }
    }

    // cập nhật thông tin result (================END==================)

    // update date of evaluation

    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                // "evaluations.$.date": dateFormat,
                "evaluations.$.evaluatingMonth": dateFormat,
                "evaluations.$.startDate": startEval,
                "evaluations.$.endDate": endEval,
            },
        },
        {
            $new: true,
        }
    );

    // update progress of evaluation
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: taskId,
            "evaluations._id": evaluateId,
        },
        {
            $set: {
                "evaluations.$.progress": progress,
            },
        },
        {
            $new: true,
        }
    );

    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creatorinactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/**
 * Cập nhật kết quả bấm giờ vào kết quả đánh giá của nhân viên
 * Chỉ tính những bấm giờ nằm trong thời gian đánh giá của tháng
 * @param {*} portal 
 * @param {*} data 
 * @param {*} taskId 
 */
exports.editHoursSpentInEvaluate = async (portal, data, taskId) => {
    let { evaluateId, timesheetLogs } = data;
    let task = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let evaluations =
        task &&
        task.evaluations &&
        task.evaluations.filter((item) => {
            if (item._id) {
                return item._id.toString() === evaluateId;
            } else return false;
        });
    let results = evaluations && evaluations[0] && evaluations[0].results;

    for (let i in timesheetLogs) {
        let timesheetLog = timesheetLogs[i];
        let { employee, hoursSpent } = timesheetLog;
        let check = true;

        if (results) {
            for (let j = 0; j < results.length; j++) {

                if (
                    results[j].employee &&
                    results[j].employee.toString() === employee.toString()
                ) {
                    check = false;
                    results[j]["hoursSpent"] = hoursSpent;
                }
            }
        }

        if (check) {
            let employeeHoursSpent = {
                employee: employee.id,
                hoursSpent: hoursSpent,
            };
            if (!results) {
                results = [];
            }
            results.push(employeeHoursSpent);
        }
    }

    let newTask = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        { _id: taskId, "evaluations._id": evaluateId },
        {
            $set: {
                "evaluations.$.results": results,
            },
        }
    );

    newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/**
 * Delete evaluations by month
 * @param {*} params
 */
exports.deleteEvaluation = async (portal, params) => {
    let { taskId, evaluationId } = params;
    await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: taskId },
        { $pull: { evaluations: { _id: evaluationId } } },
        { $new: true }
    );
    // let newTask = await Task(connect(DB_CONNECTION, portal)).findById(taskId);
    let newTask = await Task(connect(DB_CONNECTION, portal))
        .findById(taskId)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    newTask.evaluations.reverse();

    return newTask;
};

/**
 * Xóa file của hoạt động
 */
exports.deleteFileOfAction = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);

    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskActions._id": params.actionId },
        { $pull: { "taskActions.$.files": { _id: params.fileId } } },
        { safe: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskActions._id": params.actionId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar",
            },
        ]);
    return task.taskActions;
};
/**
 * Xóa file bình luận của hoạt động
 */
exports.deleteFileCommentOfAction = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskActions" },
        { $replaceRoot: { newRoot: "$taskActions" } },
        { $match: { _id: mongoose.Types.ObjectId(params.actionId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);
    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskActions._id": params.actionId },
        {
            $pull: {
                "taskActions.$.comments.$[].files": { _id: params.fileId },
            },
        },
        { safe: true }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskActions._id": params.actionId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar",
            },
        ]);
    return task.taskActions;
};
/**
 * Xóa file trao đổi
 */
exports.deleteFileTaskComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);

    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskComments._id": params.commentId },
        { $pull: { "taskComments.$.files": { _id: params.fileId } } },
        { safe: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskComments._id": params.commentId })
        .populate([
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskComments.evaluations.creator",
                select: "name email avatar",
            },
        ]);
    return task.taskComments;
};
/**
 * Xóa file bình luận của bình luận
 */
exports.deleteFileChildTaskComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$taskComments" },
        { $replaceRoot: { newRoot: "$taskComments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { "files._id": mongoose.Types.ObjectId(params.fileId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);

    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "taskComments._id": params.commentId },
        {
            $pull: {
                "taskComments.$.comments.$[].files": { _id: params.fileId },
            },
        },
        { safe: true }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId, "taskComments._id": params.commentId })
        .populate([
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskComments.evaluations.creator",
                select: "name email avatar",
            },
        ]);
    return task.taskComments;
};

/**
 * Gửi email khi kích hoạt công việc
 * @param {*} portal id công ty
 * @param {*} task công việc kích hoạt
 */
exports.sendEmailForActivateTask = async (portal, task) => {
    task = await task
        .populate("organizationalUnit creator parent")
        .execPopulate();

    var email, userId, user, users, userIds;

    var resId = task.responsibleEmployees; // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: resId },
    });
    res = res.map((item) => item.name);
    userIds = resId;
    var accId = task.accountableEmployees; // lấy id người phê duyệt
    var acc = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: accId },
    });
    userIds.push(...accId);

    var conId = task.consultedEmployees; // lấy id người tư vấn
    var con = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: conId },
    });
    userIds.push(...conId);

    var infId = task.informedEmployees; // lấy id người quan sát
    var inf = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: infId },
    });
    userIds.push(...infId); // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map((u) => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds },
    });

    email = user.map((item) => item.email);

    var html =
        `<p>Công việc mà bạn tham gia đã được kích hoạt từ trạng thái đang chờ thành đang thực hiện:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${task._id} </a></p> ` +
        `<h3>Thông tin công việc</h3>` +
        `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item}</li>`;
        }).join('')}
                    </ul>` +
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name}</li>`;
        }).join('')}
                    </ul>` +
        `${con.length > 0
            ? `<p>Người tư vấn</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name}</li>`;
            }).join('')}
                    </ul>`
            : ""
        }` +
        `${inf.length > 0
            ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name}</li>`;
            }).join('')}
                    </ul>`
            : ""
        }`;
    return { task: task, user: userIds, email: email, html: html };
};

/**
 * edit status of task
 * @param taskID id công việc
 * @param body trang thai công việc
 */
exports.editActivateOfTask = async (portal, taskID, body) => {
    let today = new Date();
    let mailArr = [];

    // Cập nhật trạng thái hoạt động của các task sau
    for (let i = 0; i < body.listSelected.length; i++) {
        let listTask = await Task(connect(DB_CONNECTION, portal)).find({
            "followingTasks.task": body.listSelected[i],
        });

        for (let x in listTask) {
            await Task(connect(DB_CONNECTION, portal)).update(
                {
                    _id: listTask[x]._id,
                    "followingTasks.task": body.listSelected[i],
                },
                {
                    $set: {
                        "followingTasks.$.activated": true,
                    },
                }
            );
        }

        let followStartDate = today;

        let followItem = await Task(connect(DB_CONNECTION, portal)).findById(
            body.listSelected[i]
        );
        let startDateItem = followItem.startDate;
        let endDateItem = followItem.endDate;
        let dayTaken = endDateItem.getTime() - startDateItem.getTime();

        let timer = followStartDate.getTime() + dayTaken;
        let followEndDate = new Date(timer).toISOString();

        await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            body.listSelected[i],
            {
                $set: {
                    status: "inprocess",
                    startDate: followStartDate,
                    endDate: followEndDate,
                },
            }
        );

        let x = await this.sendEmailForActivateTask(portal, followItem);

        mailArr.push(x);
    }

    let task = await Task(connect(DB_CONNECTION, portal))
        .findById(taskID)
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    task.evaluations.reverse();

    return { task: task, mailInfo: mailArr };
};

/** Xác nhận công việc */
exports.confirmTask = async (portal, taskId, userId) => {
    let confirmedByEmployee = await Task(
        connect(DB_CONNECTION, portal)
    ).findByIdAndUpdate(taskId, { $push: { confirmedByEmployees: userId } });

    let task = await this.getTaskById(portal, taskId, userId);
    return task;
};

/** Yêu cầu kết thúc công việc */
exports.requestAndApprovalCloseTask = async (portal, taskId, data) => {
    const { userId, taskStatus, description, type } = data;

    let keyUpdate = {};

    if (type === 'request') {
        keyUpdate = {
            "requestToCloseTask": {
                "requestedBy": userId,
                "taskStatus": taskStatus,
                "description": description,
                "requestStatus": 1
            }
        }
    }
    else if (type === 'cancel_request') {
        keyUpdate = {
            "requestToCloseTask": {
                "requestedBy": userId,
                "taskStatus": taskStatus,
                "description": description,
                "requestStatus": 0
            }
        }
    }
    else if (type === 'approval') {
        keyUpdate = {
            "requestToCloseTask": {
                "requestedBy": userId,
                "taskStatus": taskStatus,
                "description": description,
                "requestStatus": 3
            },
            "status": taskStatus
        }
    }
    else if (type === 'decline') {
        keyUpdate = {
            "requestToCloseTask": {
                "requestedBy": userId,
                "taskStatus": taskStatus,
                "description": description,
                "requestStatus": 2
            }
        }
    }

    let requestCloseByEmployee = await Task(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(taskId, keyUpdate, { new: true });

    let task = await this.getTaskById(portal, taskId, userId);
    return task;
};

/** Mở lại công việc đã kết thúc */
exports.openTaskAgain = async (portal, taskId, data) => {
    const { userId } = data;

    let taskUpdate = await Task(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            taskId,
            {
                status: 'inprocess',
                requestToCloseTask: {
                    "requestStatus": 0
                }
            },
            { new: true }
        );

    let task = await this.getTaskById(portal, taskId, userId);

    return task;
}

/** Funtion lọc các phần tử khác nhau trong mảng trước và sau khi thay đổi */
filterArrayBeforeAndAfter = async (newArrays, oldArrays) => {
    let newElement = [], oldElement = [];
    newArrays.map(item => {
        if (!oldArrays.includes(item)) {
            newElement.push(item);
        };
    })
    oldArrays?.map(item => {
        if (!newArrays.includes(item)) {
            oldElement.push(item);
        };
    });

    return { 
        newElement: newElement,
        oldElement: oldElement
    }
}

/** Function lọc nhân viên tham gia trước và sau */
filterEmployeeBeforeAndAfter = async (newEmloyees, oldEmployees) => {
    let data = await filterArrayBeforeAndAfter(newEmloyees.map(item => item?._id), oldEmployees.map(item => item?._id))
    let newEmployee = '', oldEmployee = '';

    data?.newElement?.map(element => {
        let employee = newEmloyees.filter(item => item?._id === element);
        newEmployee = newEmployee + employee?.[0]?.name + ', ';
    })
    data?.oldElement?.map(element => {
        let employee = oldEmployees?.filter(item => item?._id === element);
        oldEmployee = oldEmployee + employee?.[0]?.name + ', ';
    });
    
    return { 
        newEmployee: newEmployee,
        oldEmployee: oldEmployee
    }
}

formatPriority = (data) => {
    if (data === 1) return 'Thấp';
    if (data === 2) return 'Trung bình';
    if (data === 3) return 'Tiêu chuẩn';
    if (data === 4) return 'Cao';
    if (data === 5) return 'Khẩn cấp';
}

formatStatus = (data) => {
    if (data === "inprocess") return 'Đang thực hiện';
    else if (data === "wait_for_approval") return 'Chờ phê duyệt';
    else if (data === "finished") return 'Đã kết thúc';
    else if (data === "delayed") return 'Tạm hoãn';
    else if (data === "canceled") return 'Bị hủy';
}

/** Function tạo mô tả lịch sử thay đổi công việc khi chỉnh sửa công việc */
exports.createDescriptionEditTaskLogs = async (portal, userId, newTask, oldTask) => {
    const { name, description, formula, parent, priority, collaboratedWithOrganizationalUnits,
        accountableEmployees, consultedEmployees, responsibleEmployees, informedEmployees,
        inactiveEmployees, taskProject, status, progress, startDate, endDate
    } = newTask;
    let descriptionLog = '';

    if (name && name !== oldTask?.name)  {
        descriptionLog = descriptionLog + '<span>Tên công việc mới: ' + name + '.</span></br>'; 
    }
    if (description && description !== oldTask?.description) {
        descriptionLog = descriptionLog + '<span>Mô tả công việc mới: ' + description + '</span>'; 
    }
    if (status && status !== oldTask?.status) {
        descriptionLog = descriptionLog + '<span>Trạng thái công việc mới: ' + formatStatus(status) + ".</span></br>";
    }
    if (priority && priority !== oldTask?.priority) {
        descriptionLog = descriptionLog + '<span>Độ ưu tiên công việc mới: ' + formatPriority(priority) + ".</span></br>";
    } 
    if (progress && progress !== oldTask?.progress) {
        descriptionLog = descriptionLog + '<span>Mức độ hoàn thành công việc mới: ' + progress + "%" + ".</span></br>";
    }
    if (startDate && (new Date(startDate)).getTime() !== oldTask?.startDate.getTime()) {
        descriptionLog = descriptionLog + '<span>Ngày bắt đầu mới: ' + formatTime(startDate) + ".</span></br>";
    }
    if (endDate && (new Date(endDate)).getTime() !== oldTask?.endDate.getTime()) {
        descriptionLog = descriptionLog + '<span>Ngày kết thúc mới: ' + formatTime(endDate) + ".</span></br>";
    }
    if (formula && formula !== oldTask?.formula) {
        descriptionLog = descriptionLog + '<span>Công thức tính điểm tự động mới: ' + formula + ".</span></br>";
    }

    if (parent?._id && parent?._id !== oldTask?.parent?._id) {
        descriptionLog = descriptionLog + '<span>Công việc cha mới: ' + parent?.name + ".</span></br>";
    } else {
        if (oldTask?.parent?._id) {
            descriptionLog = descriptionLog + '<span>Xóa công việc cha' + ".</span></br>";
        }
    }

    if (collaboratedWithOrganizationalUnits) {
        let newcollaborated = collaboratedWithOrganizationalUnits.map(item => item?.organizationalUnit?._id);
        let oldcollaborated = oldTask?.collaboratedWithOrganizationalUnits?.map(item => item?.organizationalUnit?._id);
        let newUnit = '', oldUnit = '';
        let data = await filterArrayBeforeAndAfter(newcollaborated, oldcollaborated);

        data?.newElement?.map(element => {
            let unit = collaboratedWithOrganizationalUnits.filter(item => item?.organizationalUnit?._id === element);
            newUnit = newUnit + unit?.[0]?.organizationalUnit?.name + ', ';
        })
        data?.oldElement?.map(element => {
            let unit = oldTask?.collaboratedWithOrganizationalUnits?.filter(item => item?.organizationalUnit?._id === element);
            oldUnit = oldUnit + unit?.[0]?.organizationalUnit?.name + ', ';
        });
        if (newUnit !== '') {
            descriptionLog = descriptionLog + '<span>Đơn vị phối hợp được thêm mới: ' + newUnit?.slice(0, newUnit.length - 2) + ".</span></br>";
        }
        if (oldUnit !== '') {
            descriptionLog = descriptionLog + '<span>Đơn vị phối hợp đã xóa bỏ: ' + oldUnit?.slice(0, oldUnit.length - 2) + ".</span></br>";
        }
    }

    if (accountableEmployees) {
        let data = await filterEmployeeBeforeAndAfter(accountableEmployees, oldTask?.accountableEmployees);
        if (data?.newEmployee && data?.newEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người phê duyệt mới: ' + data?.newEmployee?.slice(0, data?.newEmployee?.length - 2) + ".</span></br>";
        }
        if (data?.oldEmployee && data?.oldEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người phê duyệt đã xóa bỏ: ' + data?.oldEmployee?.slice(0, data?.oldEmployee?.length - 2) + ".</span></br>";
        }
    }
    if (responsibleEmployees) {
        let data = await filterEmployeeBeforeAndAfter(responsibleEmployees, oldTask?.responsibleEmployees);
        if (data?.newEmployee && data?.newEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người thực hiện mới: ' + data?.newEmployee?.slice(0, data?.newEmployee?.length - 2) + ".</span></br>";
        }
        if (data?.oldEmployee && data?.oldEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người thực hiện đã xóa bỏ: ' + data?.oldEmployee?.slice(0, data?.oldEmployee?.length - 2) + ".</span></br>";
        }
    }
    if (consultedEmployees) {
        let data = await filterEmployeeBeforeAndAfter(consultedEmployees, oldTask?.consultedEmployees);
        if (data?.newEmployee && data?.newEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người tư vấn mới: ' + data?.newEmployee?.slice(0, data?.newEmployee?.length - 2) + ".</span></br>";
        }
        if (data?.oldEmployee && data?.oldEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người tư vấn đã xóa bỏ: ' + data?.oldEmployee?.slice(0, data?.oldEmployee?.length - 2) + ".</span></br>";
        }
    }
    if (informedEmployees) {
        let data = await filterEmployeeBeforeAndAfter(informedEmployees, oldTask?.informedEmployees);
        if (data?.newEmployee && data?.newEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người quan sát mới: ' + data?.newEmployee?.slice(0, data?.newEmployee?.length - 2) + ".</span></br>";
        }
        if (data?.oldEmployee && data?.oldEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên có vai trò người quan sát đã xóa bỏ: ' + data?.oldEmployee?.slice(0, data?.oldEmployee?.length - 2) + ".</span></br>";
        }
    }
    if (inactiveEmployees) {
        let data = await filterEmployeeBeforeAndAfter(inactiveEmployees, oldTask?.inactiveEmployees);
        if (data?.newEmployee && data?.newEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Thêm nhân viên không còn tham gia công việc: ' + data?.newEmployee?.slice(0, data?.newEmployee?.length - 2) + ".</span></br>";
        }
        if (data?.oldEmployee && data?.oldEmployee !== '') {
            descriptionLog = descriptionLog + '<span>Nhân viên không còn tham gia công việc đã tham gia lại: ' + data?.oldEmployee?.slice(0, data?.oldEmployee?.length - 2) + ".</span></br>";
        }
    }

    return descriptionLog;
}

/** Chỉnh sửa taskInformation của task */
exports.editTaskInformation = async (
    portal,
    taskId,
    userId,
    taskInformations
) => {
    let information;

    if (taskInformations && taskInformations.length !== 0) {
        for (let i = 0; i < taskInformations.length; i++) {
            information = await Task(connect(DB_CONNECTION, portal)).updateOne(
                {
                    _id: taskId,
                    "taskInformations._id": taskInformations[i]._id,
                },
                {
                    $set: {
                        "taskInformations.$.description":
                            taskInformations[i].description,
                        "taskInformations.$.name": taskInformations[i].name,
                        "taskInformations.$.type": taskInformations[i].type,
                        "taskInformations.$.isOutput":
                            taskInformations[i].isOutput,
                    },
                }
            );
        }
    }

    let task = await this.getTaskById(portal, taskId, userId);
    return task;
};

/**
 * Chinh sua trang thai luu kho cua cong viec
 * @param taskID id công việc
 */
exports.editArchivedOfTask = async (portal, taskID) => {
    let task;
    let t = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
        taskID
    );

    let isArchived = t.isArchived;
    if (t.status === 'finished' || t.status === 'delayed' || t.status === 'canceled') {
        task = await Task(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            taskID,
            { $set: { isArchived: !isArchived } },
            { new: true }
        );
    } else {
        throw ['task_status_error']
    }
    return task;
};

/**
 * Xoa file cua task
 */
exports.deleteFileTask = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);
    fs.unlinkSync(file[0].url);

    let task = await Task(connect(DB_CONNECTION, portal)).update(
        {
            _id: params.taskId,
            "documents._id": params.documentId,
            "documents.files._id": params.fileId,
        },
        { $pull: { "documents.$.files": { _id: params.fileId } } },
        { safe: true }
    );
    let task1 = await Task(connect(DB_CONNECTION, portal))
        .findById({ _id: params.taskId })
        .populate([{ path: "documents.creator", select: "name email avatar" }]);

    return task1.documents;
};

/**
 * Xoa document cua task
 */
exports.deleteDocument = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$documents" },
        { $replaceRoot: { newRoot: "$documents" } },
        { $match: { _id: mongoose.Types.ObjectId(params.documentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }

    let task = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "documents._id": params.documentId },
        { $pull: { documents: { _id: params.documentId } } },
        { safe: true }
    );
    let task1 = await Task(connect(DB_CONNECTION, portal))
        .findById({ _id: params.taskId })
        .populate([{ path: "documents.creator", select: "name email avatar" }]);

    return task1.documents;
};
/**
 * Sua document
 */
exports.editDocument = async (portal, taskId, documentId, body, files) => {
    let document;

    if (documentId) {
        document = await Task(connect(DB_CONNECTION, portal)).updateOne(
            { _id: taskId, "documents._id": documentId },
            {
                $set: {
                    "documents.$.description": body.description,
                    "documents.$.isOutput": body.isOutput,
                },

                $push: {
                    "documents.$.files": files,
                },
            }
        );
    } else {
        if (body && body.length !== 0) {
            for (let i = 0; i < body.length; i++) {
                document = await Task(connect(DB_CONNECTION, portal)).updateOne(
                    { _id: taskId, "documents._id": body[i]._id },
                    {
                        $set: {
                            "documents.$.description": body[i].description,
                            "documents.$.isOutput": body[i].isOutput,
                        },

                        $push: {
                            "documents.$.files": files,
                        },
                    }
                );
            }
        }
    }

    let task = await Task(connect(DB_CONNECTION, portal))
        .findById({ _id: taskId })
        .populate([{ path: "documents.creator", select: "name email avatar" }]);

    return task.documents;
};

/**
 *  thêm bình luận
 */
exports.createComment = async (portal, params, body, files) => {
    const commentss = {
        description: body.description,
        creator: body.creator,
        files: files,
    };
    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId },
        { $push: { commentsInProcess: commentss } },
        { new: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    return task;
};

/**
 * Sửa bình luận
 */
exports.editComment = async (portal, params, body, files) => {
    let commentss = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        {
            $set: { "commentsInProcess.$.description": body.description },
        }
    );

    let comment1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        {
            $push: {
                "commentsInProcess.$.files": files,
            },
        }
    );
    let comment = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    return comment;
};

/**
 * Delete comment
 */
exports.deleteComment = async (portal, params) => {
    let files1 = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);

    let files2 = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);
    let files = [...files1, ...files2];
    let i;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let comments = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        { $pull: { commentsInProcess: { _id: params.commentId } } },
        { safe: true }
    );
    let comment = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "commentsInProcess.creator", select: "name email avatar " },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
        ]);
    return comment;
};

/**
 *  thêm bình luận cua binh luan
 */
exports.createChildComment = async (portal, params, body, files) => {
    let commentss = await Task(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        {
            $push: {
                "commentsInProcess.$.comments": {
                    creator: body.creator,
                    description: body.description,
                    files: files,
                },
            },
        }
    );
    let comment = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    return comment;
};
/**
 * Edit comment of comment
 */
exports.editChildComment = async (portal, params, body, files) => {
    let now = new Date();
    let comment1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
            "commentsInProcess.comments._id": params.childCommentId,
        },
        {
            $set: {
                "commentsInProcess.$.comments.$[elem].description":
                    body.description,
                "commentsInProcess.$.comments.$[elem].updatedAt": now,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.childCommentId,
                },
            ],
        }
    );
    let action1 = await Task(connect(DB_CONNECTION, portal)).updateOne(
        {
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
            "commentsInProcess.comments._id": params.childCommentId,
        },
        {
            $push: {
                "commentsInProcess.$.comments.$[elem].files": files,
            },
        },
        {
            arrayFilters: [
                {
                    "elem._id": params.childCommentId,
                },
            ],
        }
    );

    let comment = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "parent", select: "name" },
            { path: "taskTemplate", select: "formula" },
            { path: "organizationalUnit" },
            { path: "collaboratedWithOrganizationalUnits.organizationalUnit" },
            {
                path:
                    "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                select: "name email _id active avatar",
            },
            {
                path: "evaluations.results.employee",
                select: "name email _id active",
            },
            {
                path: "evaluations.results.organizationalUnit",
                select: "name _id",
            },
            { path: "evaluations.results.kpis" },
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
            { path: "taskComments.creator", select: "name email avatar" },
            {
                path: "taskComments.comments.creator",
                select: "name email avatar",
            },
            { path: "documents.creator", select: "name email avatar" },
            { path: "followingTasks.task" },
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
            { path: "timesheetLogs.creator", select: "name avatar _id email" },
            { path: "hoursSpentOnTask.contributions.employee", select: "name" },
            {
                path: "process",
                populate: {
                    path: "tasks",
                    populate: [
                        { path: "parent", select: "name" },
                        { path: "taskTemplate", select: "formula" },
                        { path: "organizationalUnit" },
                        {
                            path:
                                "collaboratedWithOrganizationalUnits.organizationalUnit",
                        },
                        {
                            path:
                                "responsibleEmployees accountableEmployees consultedEmployees informedEmployees confirmedByEmployees creator inactiveEmployees",
                            select: "name email _id active avatar",
                        },
                        {
                            path: "evaluations.results.employee",
                            select: "name email _id active",
                        },
                        {
                            path: "evaluations.results.organizationalUnit",
                            select: "name _id",
                        },
                        { path: "evaluations.results.kpis" },
                        {
                            path: "taskActions.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskActions.evaluations.creator",
                            select: "name email avatar ",
                        },
                        {
                            path: "taskComments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "taskComments.comments.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "documents.creator",
                            select: "name email avatar",
                        },
                        { path: "process" },
                        {
                            path: "commentsInProcess.creator",
                            select: "name email avatar",
                        },
                        {
                            path: "commentsInProcess.comments.creator",
                            select: "name email avatar",
                        },
                    ],
                },
            },
        ]);
    return comment;
};

/**
 * Delete comment of comment
 */
exports.deleteChildComment = async (portal, params) => {
    let files = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.childCommentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
    ]);
    let i = 0;
    for (i = 0; i < files.length; i++) {
        fs.unlinkSync(files[i].url);
    }
    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        {
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
            "commentsInProcess.comments._id": params.childCommentId,
        },
        {
            $pull: {
                "commentsInProcess.$.comments": { _id: params.childCommentId },
            },
        },
        { safe: true }
    );

    let comment = await Task(connect(DB_CONNECTION, portal))
        .findOne({
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
        })
        .populate([
            { path: "commentsInProcess.creator", select: "name email avatar " },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
        ]);

    return comment;
};

/**
 * Xóa file của bình luận
 */
exports.deleteFileComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);
    fs.unlinkSync(file[0].url);

    let comment1 = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        { $pull: { "commentsInProcess.$.files": { _id: params.fileId } } },
        { safe: true }
    );
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
        })
        .populate([
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
        ]);

    return task;
};

/**
 * Xóa file bình luận con
 */
exports.deleteFileChildComment = async (portal, params) => {
    let file = await Task(connect(DB_CONNECTION, portal)).aggregate([
        { $match: { _id: mongoose.Types.ObjectId(params.taskId) } },
        { $unwind: "$commentsInProcess" },
        { $replaceRoot: { newRoot: "$commentsInProcess" } },
        { $match: { _id: mongoose.Types.ObjectId(params.commentId) } },
        { $unwind: "$comments" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $match: { _id: mongoose.Types.ObjectId(params.childCommentId) } },
        { $unwind: "$files" },
        { $replaceRoot: { newRoot: "$files" } },
        { $match: { _id: mongoose.Types.ObjectId(params.fileId) } },
    ]);

    fs.unlinkSync(file[0].url);

    let action = await Task(connect(DB_CONNECTION, portal)).update(
        { _id: params.taskId, "commentsInProcess._id": params.commentId },
        {
            $pull: {
                "commentsInProcess.$.comments.$[].files": {
                    _id: params.fileId,
                },
            },
        },
        { safe: true }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({
            _id: params.taskId,
            "commentsInProcess._id": params.commentId,
        })
        .populate([
            { path: "commentsInProcess.creator", select: "name email avatar" },
            {
                path: "commentsInProcess.comments.creator",
                select: "name email avatar",
            },
        ]);
    return task;
};
/**
 * Lấy tất cả preceeding tasks
 * @param {*} portal
 * @param {*} params
 */
exports.getAllPreceedingTasks = async (portal, params) => {
    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            {
                path: "preceedingTasks.task",
                populate: [
                    {
                        path: "commentsInProcess.creator",
                        select: "name email avatar",
                    },
                    {
                        path: "commentsInProcess.comments.creator",
                        select: "name email avatar",
                    },
                ],
            },
        ]);
    return task.preceedingTasks;
};

/**
 * Sắp xếp hoạt động
 * @param {*} portal
 * @param {*} body
 */
exports.sortActions = async (portal, params, body) => {
    let arrayActions = body;
    let taskId = params.taskId;
    let i;
    await Task(connect(DB_CONNECTION, portal)).update(
        { _id: taskId },
        { $set: { "taskActions": [] } }
    )
    await Task(connect(DB_CONNECTION, portal)).update(
        { _id: taskId },
        {
            $set: {
                "taskActions": body
            },
        }
    );

    let task = await Task(connect(DB_CONNECTION, portal))
        .findOne({ _id: params.taskId })
        .populate([
            { path: "taskActions.creator", select: "name email avatar" },
            {
                path: "taskActions.comments.creator",
                select: "name email avatar",
            },
            {
                path: "taskActions.evaluations.creator",
                select: "name email avatar ",
            },
        ]);
    return task.taskActions;
};
