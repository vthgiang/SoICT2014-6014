const mongoose = require("mongoose");
const { Task, TaskTemplate, TaskAction, TaskTemplateInformation, Role, OrganizationalUnit, User, UserRole } = require('../../../models/index').schema;

const moment = require("moment");
const nodemailer = require("nodemailer");

const OrganizationalUnitService = require('../../super-admin/organizational-unit/organizationalUnit.service');
const overviewService = require('../../kpi/employee/management/management.service');

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
    let start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

    let endTime = endDate.split("-");
    let end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    let filterDate = {};

    if (data.responsibleEmployees) {
        responsible = data.responsibleEmployees;
    }

    if (data.accountableEmployees) {
        accountable = data.accountableEmployees;
    }

    (taskStatus === 1) ? taskStatus = "Finished" : (taskStatus === 2 ? taskStatus = "Inprocess" : "");

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

    let condition = [
        { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
        { $match: { taskTemplate: mongoose.Types.ObjectId(idTemplate) } },
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
    ];


    if (taskStatus === 0) { // Lọc tất cả các coong việc không theo đặc thù
        console.log('b');
        condition = [
            ...condition,
            filterDate
        ]

    } else
        // nếu không lọc theo người thực hiện và người phê duyệt
        if (typeof responsible === 'undefined' && typeof accountable === 'undefined') {
            condition = [
                { $match: { status: taskStatus } },
                ...condition,
                filterDate
            ]

        } else {
            condition = [
                { $match: { status: taskStatus } },
                { $match: { responsibleEmployees: { $in: [...responsible.map(x => mongoose.Types.ObjectId(x.toString()))] } } },
                { $match: { accountableEmployees: { $in: [...accountable.map(y => mongoose.Types.ObjectId(y.toString()))] } } },
                ...condition,
                filterDate,

            ]
        }


    let result = await Task.aggregate(condition);

    // let result2 = [];
    return result;


}

/**
 * Lấy mẫu công việc theo Id
 */
exports.getTaskById = async (id, userId) => {
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
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id : id người dùng
 */
exports.getTasksCreatedByUser = async (id) => {
    var tasks = await Task.find({
        creator: id
    }).populate({ path: 'taskTemplate', model: TaskTemplate });
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

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
                $in: organizationalUnit,
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special !== '[]') {
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

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
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
        if (endDate) {
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
    }

    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $gte: start,
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            endDate: {
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
 * @task dữ liệu từ params
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, aPeriodOfTime } = task;

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
                $in: organizationalUnit,
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special !== '[]') {
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

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
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

        if (endDate) {
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
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, aPeriodOfTime } = task;

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
                $in: organizationalUnit,
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special !== '[]') {
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

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
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

        if (endDate) {
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
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, aPeriodOfTime } = task;

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
                $in: organizationalUnit,
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special !== '[]') {
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

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
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

        if (endDate) {
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
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, aPeriodOfTime } = task;

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
                $in: organizationalUnit,
            }
        };
    }

    if (status !== '[]') {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority !== '[]') {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special !== '[]') {
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

    if (name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    };

    if (JSON.parse(aPeriodOfTime)) {

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { 'startDate': { $lte: new Date(endDate), $gt: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lte: new Date(startDate) } }] }
            ]
        }
    } else {
        if (startDate) {
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

        if (endDate) {
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
 * Lấy công việc theo id đơn vị
 * @task dữ liệu từ params
 */
exports.getAllTaskOfOrganizationalUnitByMonth = async (task) => {
    var { organizationalUnitId, startDateAfter, endDateBefore } = task;
    var organizationUnitTasks;
    var keySearch = {};

    if (organizationalUnitId !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }

    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);
        console.log("start: ", start)
        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
            // $or: [
            //     { startDate: { $gte: start } },
            //     { endDate: { $gte: start } }
            // ]
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);
        console.log("end : ", end)
        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
            // $or: [
            //     { startDate: { $lte: end } },
            //     { endDate: { $lte: end } }
            // ]
        }
    }
    organizationUnitTasks = await Task.find(keySearch).sort({ 'createdAt': 'asc' })
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    return {
        "tasks": organizationUnitTasks
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

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var email, userId, user, users, userIds;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User.find({ _id: { $in: resId } });
    res = res.map(item => item.name);
    userIds = resId;
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
    var html = `<p>Bạn được giao nhiệm vụ trong công việc:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${task._id} </a></p> ` +
        `<h3>Thông tin công việc</h3>` +
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
 * get task by user
 * @param {*} data 
 */

exports.getTasksByUser = async (data) => {
    var tasks = [];
    if (data.data == "user") {
        tasks = await Task.find({
            $or: [
                { responsibleEmployees: data.userId },
                { accountableEmployees: data.userId },
                { consultedEmployees: data.userId },
                { informedEmployees: data.userId }
            ],
            status: "Inprocess"
        })
    }

    if (data.data == "organizationUnit") {
        for (let i in data.organizationUnitId) {
            var organizationalUnit = await OrganizationalUnit.findOne({ _id: data.organizationUnitId[i] })
            var test = await Task.find(
                { organizationalUnit: organizationalUnit._id, status: "Inprocess" },
            )

            for (let j in test) {
                tasks.push(test[j]);
            }
        }
    }



    var nowdate = new Date();
    var tasksexpire = [], deadlineincoming = [], test;
    for (let i in tasks) {
        var olddate = new Date(tasks[i].endDate);
        test = nowdate - olddate;
        if (test < 0) {
            test = olddate - nowdate;
            var totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            if (totalDays <= 7) {
                var tasktest = {
                    task: tasks[i],
                    totalDays: totalDays
                }
                deadlineincoming.push(tasktest);
            }
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

/**
 * Lấy tất cả task của organizationalUnit theo tháng 
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getAllTaskOfOrganizationalUnit = async (roleId, organizationalUnitId, month) => {
    let organizationalUnit;
    let now, currentYear, currentMonth, endOfCurrentMonth, endOfLastMonth;

    if (month) {
        now = new Date(month);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    } else {
        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    }

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        organizationalUnit = await OrganizationalUnit.findOne({ '_id': organizationalUnitId });
    }

    let tasksOfOrganizationalUnit = await Task.aggregate([
        { $match: { 'organizationalUnit': organizationalUnit._id } },
        {
            $match: {
                $or: [
                    { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                    { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                    { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
                ]
            }
        },

        { $unwind: "$evaluations" },
        {
            $match: {
                $or: [
                    { 'evaluations.date': undefined },
                    { 'evaluations.date': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } }
                ]
            }
        },
        // { $replaceRoot: { newRoot: '$evaluations' } }
        { $project: { 'startDate': 1, 'endDate': 1, 'evaluations': 1, 'accountableEmployees': 1, 'consultedEmployees': 1, 'informedEmployees': 1, 'status': 1 } }
    ])

    return tasksOfOrganizationalUnit;
}

/**
 * Lấy tất cả task của các đơn vị con của đơn vị hiện tại 
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getAllTaskOfChildrenOrganizationalUnit = async (companyId, roleId, month) => {

    let tasksOfChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(companyId, roleId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        tasksOfChildrenOrganizationalUnit.push(await this.getAllTaskOfOrganizationalUnit(roleId, childrenOrganizationalUnits[i].id, month));
        tasksOfChildrenOrganizationalUnit[i].unshift({ 'name': childrenOrganizationalUnits[i].name, 'deg': childrenOrganizationalUnits[i].deg })
    }
    return tasksOfChildrenOrganizationalUnit;
}