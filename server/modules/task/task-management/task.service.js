const mongoose = require("mongoose");
const { Task, TaskTemplate, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit, User } = require('../../../models/index').schema;
const moment = require("moment");
const nodemailer = require("nodemailer");

/**
 * Lấy tất cả các công việc
 */
exports.getAllTasks = async () => {
    var tasks = await Task.find();
    return tasks;
}

/**
 * Lấy tất cả công việc theo id mẫu công việc thỏa mãn điều kiện
 * @param {*} data 
 */
exports.getTaskEvaluations = async (data) => {
    // Lấy keySearch tu client gui trong body
    let organizationalUnit = data.organizationalUnit;
    let idTemplate = data.taskTemplate;
    let taskStatus = Number(data.status);
    let responsible, accountable;
    let startDate = data.startDate;
    let endDate = data.endDate;

    let startTime = startDate.split("-");
    let endTime = endDate.split("-");
    let start = new Date(startTime[2], startTime[1] - 1, startTime[0]);
    let end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    let filterDate = {};

    if (data.responsibleEmployees) { // bỏ toString để check lọc ko có responsible và accountable, ko bỏ thì lỗi
        responsible = data.responsibleEmployees.toString();
    }
    if (data.accountableEmployees) {
        accountable = data.accountableEmployees.toString();
    }
    (taskStatus === 0) ? taskStatus = "Finished" : taskStatus = "Inprocess";

    // Lọc nếu ngày bắt đầu và kết thức có giá trị
    if (startDate && endDate) {
        filterDate = {
            $match: {
                date: { $gte: start, $lt: end }
            }
        }
    }

    // Lọc nếu có ngày bắt đầu, không có ngày kết thúc 
    if (startDate && !endDate) {
        filterDate = {
            $match: {
                date: { $gte: start }
            }
        }

    }

    //  Lọc nếu có ngày bắt đầu, không có ngày kết thúc 
    if (!startDate && endDate) {
        filterDate = {
            $match: {
                date: { $lte: end }
            }
        }
    }

    let condition = [];
    // nếu không lọc theo người thực hiện và người phê duyệt
    if (typeof responsible === 'undefined' && typeof accountable === 'undefined') {
        condition = [
            { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
            { $match: { taskTemplate: mongoose.Types.ObjectId(idTemplate) } },
            { $match: { status: taskStatus } },
            { $unwind: "$responsibleEmployees" },
            { $unwind: "$accountableEmployees" },
            { $unwind: "$evaluations" },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { status: "$status" }, { responsibleEmployees: "$responsibleEmployees" },
                        { accountableEmployees: "$accountableEmployees" },
                        { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                    }
                }
            },
            filterDate
        ]

    } else if (!startDate && !endDate) {
        condition = [
            { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
            { $match: { taskTemplate: mongoose.Types.ObjectId(idTemplate) } },
            { $match: { status: taskStatus } },
            { $match: { responsibleEmployees: { $all: [[mongoose.Types.ObjectId(responsible),]] } } },
            { $match: { accountableEmployees: { $all: [[mongoose.Types.ObjectId(accountable),]] } } },
            { $unwind: "$responsibleEmployees" },
            { $unwind: "$accountableEmployees" },
            { $unwind: "$evaluations" },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [{ name: "$name" }, { responsibleEmployees: "$responsibleEmployees" },
                        { accountableEmployees: "$accountableEmployees" }, { taskId: "$_id" }, { status: "$status" },
                        { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                    }
                }
            }

        ]
    }
    else {
        condition = [
            { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
            { $match: { taskTemplate: mongoose.Types.ObjectId(idTemplate) } },
            { $match: { status: taskStatus } },
            { $match: { responsibleEmployees: { $all: [[mongoose.Types.ObjectId(responsible),]] } } },
            { $match: { accountableEmployees: { $all: [[mongoose.Types.ObjectId(accountable),]] } } },
            { $unwind: "$responsibleEmployees" },
            { $unwind: "$accountableEmployees" },
            { $unwind: "$evaluations" },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [{ name: "$name" }, { responsibleEmployees: "$responsibleEmployees" },
                        { accountableEmployees: "$accountableEmployees" }, { taskId: "$_id" }, { status: "$status" },
                        { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                    }
                }
            },
            filterDate
        ]
    }
    let result = await Task.aggregate(condition);
    let condition2 = [
        { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
        { $match: { taskTemplate: mongoose.Types.ObjectId(idTemplate) } },
        { $match: { status: taskStatus } },

        { $match: { responsibleEmployees: { $all: [[mongoose.Types.ObjectId(responsible),]] } } },
        { $match: { accountableEmployees: { $all: [[mongoose.Types.ObjectId(accountable),]] } } },
        { $unwind: "$responsibleEmployees" },
        { $unwind: "$accountableEmployees" },
        { $unwind: "$evaluations" },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{ name: "$name" }, { responsibleEmployees: "$responsibleEmployees" },
                    { accountableEmployees: "$accountableEmployees" }, { taskId: "$_id" }, { status: "$status" },
                    { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                }
            }
        },
        filterDate,
        { $unwind: "$taskInformations" },
        {
            $replaceRoot: { newRoot: { $mergeObjects: ["$taskInformations"] } }
        },
        { $match: { type: "Number" } },
        {
            $group: {
                _id: { _id: "$_id", name: "$name" },
                avgSum: { $avg: { $sum: "$value" } }
                //            avgSum: { $sum: "$value"}
            }

        },

    ]
    let result2 = await Task.aggregate(condition2);
    return { result, result2 };
    //{"taskTemplate": ObjectId("5f107afff000733a180c1077"),"status": "Finished", "evaluations.taskInformations": { $elemMatch: { code: "p1" } }}
}
/**
 * Lấy mẫu công việc theo Id
 */
exports.getTask = async (id, userId) => {
    //req.params.id
    var superTask = await Task.findById(id)
        .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees creator parent" })
        .populate("evaluations.results.employee")
        .populate("evaluations.kpis.employee")
        .populate("evaluations.kpis.kpis")

    var task = await Task.findById(id).populate([
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
        { path: "files.creator", model: User, select: 'name email avatar' },
    ])
    var responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
    responsibleEmployees = task.responsibleEmployees;
    accountableEmployees = task.accountableEmployees;
    consultedEmployees = task.consultedEmployees;
    informedEmployees = task.informedEmployees;
    var flag = 0;
    for (let n in responsibleEmployees) {
        if (JSON.stringify(responsibleEmployees[n]._id) === JSON.stringify(userId)) {
            flag = 1;
            break;
        }
    }
    for (let n in accountableEmployees) {
        if (JSON.stringify(accountableEmployees[n]._id) === JSON.stringify(userId)) {
            flag = 1;
            break;
        }
    }
    for (let n in consultedEmployees) {
        if (JSON.stringify(consultedEmployees[n]._id) === JSON.stringify(userId)) {
            flag = 1;
            break;
        }
    }
    for (let n in informedEmployees) {
        if (JSON.stringify(informedEmployees[n]._id) === JSON.stringify(userId)) {
            flag = 1;
            break;
        }
    }
    if (task.creator._id.equals(userId)) {
        flag = 1;
    }
    if (flag === 0) {
        return {
            "info": null
        }
    }
    task.evaluations.reverse();
    return task;

}

/**
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id: id người dùng
 */
exports.getTasksCreatedByUser = async (id) => {
    var tasks = await Task.find({
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = task;

    var responsibleTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        responsibleEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if (special !== '[]') {
        special = special.split(",");
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (startDate !== 'null') {
        let startTime = startDate.split("-");
        let start = new Date(startTime[1], startTime[0] - 1, 1);
        let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (endDate !== 'null') {
        let endTime = endDate.split("-");
        let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTime[1], endTime[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (startDateAfter !== 'null') {
        let startTimeAfter = startDateAfter.split("-");
        let start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);
        // let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gte: start,
                // $lte: end
            }
        }
    }

    if (endDateBefore !== 'null') {
        let endTimeBefore = endDateBefore.split("-");
        // let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                // $gt: start, 
                $lte: end
            }
        }
    }

    responsibleTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": responsibleTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate } = task;

    var accountableTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        accountableEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if (special !== '[]') {
        special = special.split(",");
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (startDate !== 'null') {
        let startTime = startDate.split("-");
        let start = new Date(startTime[1], startTime[0] - 1, 1);
        let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (endDate !== 'null') {
        let endTime = endDate.split("-");
        let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTime[1], endTime[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    accountableTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc hỗ trợ theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate } = task;

    var consultedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        consultedEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if (special !== '[]') {
        special = special.split(",");
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (startDate !== 'null') {
        let startTime = startDate.split("-");
        let start = new Date(startTime[1], startTime[0] - 1, 1);
        let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (endDate !== 'null') {
        let endTime = endDate.split("-");
        let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTime[1], endTime[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    consultedTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": consultedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate } = task;

    var creatorTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        creator: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if (special !== '[]') {
        special = special.split(",");
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (startDate !== 'null') {
        let startTime = startDate.split("-");
        let start = new Date(startTime[1], startTime[0] - 1, 1);
        let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (endDate !== 'null') {
        let endTime = endDate.split("-");
        let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTime[1], endTime[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    creatorTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": creatorTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate } = task;

    var informedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        informedEmployees: {
            $in: [user]
        },
        isArchived: false
    };

    if (organizationalUnit !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit.split(",")
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status.split(",")
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority.split(",")
            }
        };
    }

    if (special !== '[]') {
        special = special.split(",");
        for (var i = 0; i < special.length; i++) {
            if (special[i] === "Lưu trong kho") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                keySearch = {
                    ...keySearch,
                    endDate: { $gte: new Date() }
                };
            }
        }
    }

    if (name !== 'null') {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (startDate !== 'null') {
        let startTime = startDate.split("-");
        let start = new Date(startTime[1], startTime[0] - 1, 1);
        let end = new Date(startTime[1], startTime[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    if (endDate !== 'null') {
        let endTime = endDate.split("-");
        let start = new Date(endTime[1], endTime[0] - 1, 1);
        let end = new Date(endTime[1], endTime[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    informedTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task.count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": informedTasks,
        "totalPage": totalPages
    };
}

/**
 * Tạo công việc mới
 */
exports.createTask = async (task) => {
    // Lấy thông tin công việc cha
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task.findById(task.parent);
        if (parent) level = parent.level + 1;
    }

    // convert thời gian từ string sang date
    var splitter = task.startDate.split("-");
    var startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = task.endDate.split("-");
    var endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate !== "") {
        taskTemplate = await TaskTemplate.findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    var task = await Task.create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskTemplate ? taskTemplate.taskInformations : [],
        taskActions: taskTemplate ? cloneActions : [],
        parent: (task.parent === "") ? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
    });

    if (task.taskTemplate !== null) {
        await TaskTemplate.findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }

    task = await task.populate("organizationalUnit creator parent").execPopulate();

    // Gửi email
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });
    var email, userId, user, users, userIds;
    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    // console.log("res :"+resId);
    var res = await User.find({ _id: { $in: resId } });
    // console.log("res :"+res);
    res = res.map(item => item.name);
    console.log("res :" + res);
    userIds = resId;
    // console.log(userIds);
    var accId = task.accountableEmployees;  // lấy id người phê duyệt
    var acc = await User.find({ _id: { $in: accId } });
    userIds.push(...accId);
    var conId = task.consultedEmployees;  // lấy id người hỗ trợ
    var con = await User.find({ _id: { $in: conId } })
    userIds.push(...conId);
    var infId = task.informedEmployees;  // lấy id người quan sát
    var inf = await User.find({ _id: { $in: infId } })
    userIds.push(...infId);  // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map(u => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }
    user = await User.find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    email.push("trinhhong102@gmail.com");
    var html = `<p>Bạn được giao nhiệm vụ trong công việc:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}">${process.env.WEBSITE}/task?taskId=${task._id}</a></p> ` +
        `<h3>Thông tin công viêc</h3>` +
        `<p>Tên công việc : ${task.name}</p>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item}</li>`
        })}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name}</li>`
        })}
                    </ul>`+
        `<p>Người hỗ trợ</p> ` +
        `<ul>${con.map((item) => {
            return `<li>${item.name}</li>`
        })}
                    </ul>`+
        `<p>Người quan sát</p> ` +
        `<ul>${inf.map((item) => {
            return `<li>${item.name}</li>`
        })}
                    </ul>`
        ;

    return { task: task, user: userIds, email: email, html: html };
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (id) => {
    //req.params.id
    var task = await Task.findByIdAndDelete(id); // xóa mẫu công việc theo id
    // var privileges = await Privilege.deleteMany({
    //     resource: id, //id của task template
    //     resourceType: "TaskTemplate"
    // });
    return task;
}

/**
 * edit status of task
 */
exports.editTaskStatus = async (taskID, status) => {
    var task = await Task.findByIdAndUpdate(taskID,
        { $set: { status: status } },
        { new: true }
    );
    return task;
}

/**
 * Chinh sua trang thai luu kho cua cong viec
 */
exports.editArchivedOfTask = async (taskID) => {
    var t = await Task.findByIdAndUpdate(taskID);
    var isArchived = t.isArchived;

    var task = await Task.findByIdAndUpdate(taskID,
        { $set: { isArchived: !isArchived } },
        { new: true }
    );

    return task;
}
/**
 * get subtask
 */
exports.getSubTask = async (taskId) => {
    var task = await Task.find({
        parent: taskId
    }).sort("createdAt")
    return task;
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

    console.log('---typeof(d.getMonth())---', typeof (d.getMonth()));

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
        console.log('TH1----chưa có evaluations');
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
        console.log('TH1========', evaluateId);
    }

    // TH2: Có evaluation nhưng chưa có tháng giống với date => tạo mới
    else if (testCase === "TH2") {
        console.log('TH2---Có evaluation nhưng chưa có tháng giống với date');
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
        console.log('TH2========', evaluateId);
    }

    // TH3: Có evaluations của tháng giống date => cập nhật evaluations
    else if (testCase === "TH3") {
        console.log('TH3----Có evaluations của tháng giống date');
        var taskV3 = initTask;
        evaluateId = taskV3.evaluations.find(e => (monthOfParams === e.date.getMonth() && yearOfParams === e.date.getFullYear()))._id;
        console.log('TH3========', evaluateId);
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
    console.log(endOfMonth);

    // if(kpi.length !== 0){
    evaluateId = await checkEvaluations(date, taskId, endOfMonth);
    console.log('evaluateId cần lấy-----', evaluateId);
    // }
    // var myTask =  await Task.findById(taskId);
    // if( evaluateId) {
    let task = await Task.findById(taskId);
    // cập nhật thông tin kpi
    var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis
    console.log('liissssssssssssss', listKpi);
    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    console.log('check_kpi', check_kpi);
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

                // console.log('task.taskInformations[i]', task.taskInformations[i]);
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

    return { newTask: newTask, email: email, user: user, tasks: tasks };
}

/**
 * edit task by responsible employee---PATCH
 */
exports.editTaskByAccountableEmployees = async (data, taskId) => {
    console.log('data', data);
    var description = data.description;
    var name = data.name;
    var priority = data.priority;
    var status = data.status;
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

    // console.log('task ============================== ' , task);

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

                // console.log('task.taskInformations[i]', task.taskInformations[i]);
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
    // console.log('newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', newTask);

    //xu ly gui email
    var tasks = await Task.findById(taskId);
    var userId = tasks.responsibleEmployees;
    var user = await User.find({ _id: { $in: userId } });
    var email = user.map(item => item.email);
    user = await User.findById(data.user);

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

    // console.log('task ============================== ' , task, task.evaluations);
    // cập nhật thông tin result

    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results

    // console.log('kkkkkkkkkkkk', listResult);

    var check_results = listResult.find(r => (String(r.employee) === user && String(r.role) === "Consulted"));
    console.log('check_results', check_results);
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

    var task = await Task.findById(taskId);

    var listKpi = task.evaluations.find(e => String(e._id) === String(evaluateId)).kpis

    var check_kpi = listKpi.find(kpi => String(kpi.employee) === user);
    console.log('check_kpi', check_kpi);
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
    // console.log('check_results',check_results);
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
                    // console.log('cloneInfo[i]', cloneInfo[i]);
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
    console.log('info', info);
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
    console.log('cloneResult', cloneResult);

    await Task.updateOne({ _id: taskId }, { $set: { status: status[0], progress: progress } });
    var task = await Task.findById(taskId);

    // cập nhật thông tin result================================================================BEGIN=====================================================

    var listResult = task.evaluations.find(e => String(e._id) === String(evaluateId)).results;

    for (let i in listResult) {
        console.log('list---------------------------------', listResult[i].role, listResult[i].employee, typeof (listResult[i].role), typeof (listResult[i].employee));
    }

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
    // console.log('list', listResult2);
    var check_approve = listResult2.find(r => (String(r.employee) === user && String(r.role) === "Accountable"));

    console.log('check_approve', check_approve);
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
                    // console.log('cloneInfo[i]', cloneInfo[i]);
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
    return newTask;
}

exports.getTasksByUser = async (data) => {
    var tasks = await Task.find({
        $or: [
            { responsibleEmployees: data },
            { accountableEmployees: data },
            { consultedEmployees: data },
            { informedEmployees: data }
        ],
        status: "Inprocess"
    })
    var nowdate = new Date();
    var tasksexpire = [], deadlineincoming = [], test;
    for (let i in tasks) {
        var olddate = new Date(tasks[i].endDate);
        test = nowdate - olddate;
        if (test < 0) {
            test = olddate - nowdate;
            var totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            var tasktest = {
                task: tasks[i],
                totalDays: totalDays
            }
            deadlineincoming.push(tasktest);
        } else {
            var totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            var tasktest = {
                task: tasks[i],
                totalDays: totalDays
            }
            tasksexpire.push(tasktest)
        }
    }
    let tasksbyuser = {
        expire: tasksexpire,
        deadlineincoming: deadlineincoming,
    }
    return tasksbyuser;
}
