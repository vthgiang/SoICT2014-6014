const mongoose = require("mongoose");
const moment = require("moment");
const nodemailer = require("nodemailer");

const { Task, TaskTemplate, OrganizationalUnit, User, Company } = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

const OrganizationalUnitService = require(`${SERVER_MODULES_DIR}/_multi-tenant/super-admin/organizational-unit/organizationalUnit.service`);
const overviewService = require(`${SERVER_MODULES_DIR}/_multi-tenant/kpi/employee/management/management.service`);

const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy tất cả các công việc
 */
exports.getAllTasks = async (portal) => {
    var tasks = await Task(connect(DB_CONNECTION, portal)).find();
    return tasks;
}

/**
 * Lấy tất cả công việc theo id mẫu công việc thỏa mãn điều kiện
 * @param {*} data 
 */
exports.getTaskEvaluations = async (portal, data) => {
    // Lấy keySearch tu client gui trong body
    let organizationalUnit = data.organizationalUnit;
    let idTemplate = data.taskTemplate;
    let taskStatus = Number(data.status);
    let responsible, accountable;
    let startDate = data.startDate;
    let endDate = data.endDate;
    let frequency = data.frequency.toString();

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
        // { $unwind: "$responsibleEmployees" },
        // { $unwind: "$accountableEmployees" },
        { $unwind: "$evaluations" },
        {
            $lookup: {
                from: "users",
                localField: "responsibleEmployees",
                foreignField: "_id",
                as: "responsibleEmployeesInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "accountableEmployees",
                foreignField: "_id",
                as: "accountableEmployeesInfo"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{ name: "$name" }, { taskId: "$_id" }, { status: "$status" }, { responsibleEmployees: "$responsibleEmployeesInfo" },
                    { accountableEmployees: "$accountableEmployeesInfo" },
                    { startDate: "$startDate" }, { endDate: "$endDate" }, { priority: "$priority" }, "$evaluations"]
                }
            }
        },

    ];

    if (!startDate && !endDate) {
        condition = [
            ...condition,
            { $match: { status: taskStatus } },
            { $sort: { date: -1 } },
        ]
    } else {
        if (taskStatus === 0) { // Lọc tất cả các coong việc không theo đặc thù
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
                    { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsible.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
                    { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountable.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
                    ...condition,
                    filterDate,

                ]
            }
    }

    let result = await Task(connect(DB_CONNECTION, portal)).aggregate(condition); // kết quả sau khi truy vấn mongodb

    // lấy danh sachs điều kiện lọc của trường thông tin của công việc
    let taskInfo = data.taskInformations;
    let listDataChart = [];
    if (data.itemListBoxRight) {
        listDataChart = data.itemListBoxRight;
        listDataChart = listDataChart.map(item => JSON.parse(item));
    }
    // let listDataChart = data.itemListBoxRight;

    taskInfo = taskInfo.map(item => JSON.parse(item));

    let configurations = [];
    // Lấy các điều kiện lọc của các trường thông tin từ client gửi về.
    for (let [index, value] of taskInfo.entries()) { // tương tự for in. (for of sử dụng Array entries function get index)
        configurations[index] = {
            filter: value.filter,
            newName: value.newName,
            chartType: value.chartType,
            coefficient: value.coefficient,
            showInReport: value.showInReport,
            aggregationType: value.aggregationType,
        }
    }

    // Add thêm các trường điều kiện lọc vào result
    let newResult = result.map((item) => {
        let taskInformations = item.taskInformations;

        /**
         * Gộp trường taskInfomation của task vào array configurations
         * Mục đích để đính kèm các điều kiện lọc của các trường thông tin vào taskInfomation để tính toán
         */

        let taskMerge = taskInformations.map((item, index) => Object.assign({}, item, configurations[index]))
        return { // Lấy các trường cần thiết
            _id: item._id,
            name: item.name,
            accountableEmployees: item.accountableEmployees,
            responsibleEmployees: item.responsibleEmployees,
            status: item.status,
            date: item.date,
            startDate: item.startDate,
            endDate: item.endDate,
            priority: item.priority,
            frequency: frequency,
            taskInformations: taskMerge,
            results: item.results,
            dataForAxisXInChart: listDataChart,
        };
    })
    return newResult;
}


/**
 * Lấy mẫu công việc theo chức danh và người dùng
 * @id : id người dùng
 */
exports.getTasksCreatedByUser = async (portal, id) => {
    var tasks = await Task(connect(DB_CONNECTION, portal)).find({
        creator: id
    }).populate({ path: 'taskTemplate' }); // , model: TaskTemplate 
    return tasks;
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (portal, task) => {
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
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
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
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }

    responsibleTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).count(keySearch);
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
exports.getPaginatedTasksThatUserHasAccountableRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

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
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    accountableTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc hỗ trợ theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

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
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    consultedTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": consultedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (portal, task) => {
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

    creatorTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": creatorTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksThatUserHasInformedRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

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
    if (startDateAfter) {
        let startTimeAfter = startDateAfter.split("-");
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    informedTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).count(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": informedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksByUser = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;

    var tasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        $or: [
            { informedEmployees: { $in: [user] } },
            { creator: { $in: [user] } },
            { responsibleEmployees: { $in: [user] } },
            { consultedEmployees: { $in: [user] } },
            { accountableEmployees: { $in: [user] } },
        ],
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
        let start;


        if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
        else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    tasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": tasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc theo id đơn vị
 * @task dữ liệu từ params
 */
exports.getAllTaskOfOrganizationalUnitByMonth = async (portal, task) => {
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

        keySearch = {
            ...keySearch,
            endDate: {
                $gte: start
            }
        }
    }

    if (endDateBefore) {
        let endTimeBefore = endDateBefore.split("-");
        let end;
        if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
        else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

        keySearch = {
            ...keySearch,
            startDate: {
                $lt: end
            }
        }
    }
    organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    return {
        "tasks": organizationUnitTasks
    };
}

exports.sendEmailFoCreateTask = async (portal, task) => {
    task = await task.populate("organizationalUnit creator parent").execPopulate();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

    var email, userId, user, users, userIds;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    res = res.map(item => item.name);
    userIds = resId;
    var accId = task.accountableEmployees;  // lấy id người phê duyệt
    var acc = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accId } });
    userIds.push(...accId);

    var conId = task.consultedEmployees;  // lấy id người hỗ trợ
    var con = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: conId } })
    userIds.push(...conId);

    var infId = task.informedEmployees;  // lấy id người quan sát
    var inf = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: infId } })
    userIds.push(...infId);  // lấy ra id của tất cả người dùng có nhiệm vụ

    // loại bỏ các id trùng nhau
    userIds = userIds.map(u => u.toString());
    for (let i = 0, max = userIds.length; i < max; i++) {
        if (userIds.indexOf(userIds[i]) != userIds.lastIndexOf(userIds[i])) {
            userIds.splice(userIds.indexOf(userIds[i]), 1);
            i--;
        }
    }
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    email.push("trinhhong102@gmail.com");
    var html = `<p>Bạn được giao nhiệm vụ trong công việc:  <a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank">${process.env.WEBSITE}/task?taskId=${task._id} </a></p> ` +
        `<h3>Thông tin công việc</h3>` +
        `<p>Tên công việc : <strong>${task.name}</strong></p>` +
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
                    </ul>` +
        `${con.length > 0 ? `<p>Người hỗ trợ</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name}</li>`
            })}
                    </ul>` : ""}` +
        `${inf.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name}</li>`
            })}
                    </ul>` : ""}`
        ;

    return { task: task, user: userIds, email: email, html: html };
}

/**
 * Tạo công việc mới
 */
exports.createTask = async (portal, task) => {
    // Lấy thông tin công việc cha
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task(connect(DB_CONNECTION, portal)).findById(task.parent);
        if (parent) level = parent.level + 1;
    }

    // convert thời gian từ string sang date
    var splitter = task.startDate.split("-");
    var startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    splitter = task.endDate.split("-");
    var endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate !== "") {
        taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findById(task.taskTemplate);
        var taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    let formula;
    if (taskTemplate) {
        formula = taskTemplate.formula;
    } else if (task.formula) {
        // formula = "progress / (dayUsed / totalDay)"; // default
        formula = "progress / (dayUsed / totalDay) - 0.5 * (10 - (averageActionRating)) * 10"
    }
    var task = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        formula: formula,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskTemplate ? taskTemplate.taskInformations : [],
        taskActions: taskTemplate ? cloneActions : [],
        parent: (task.parent === "") ? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? task.creator : []
    });

    if (task.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            task.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }

    let mail = await this.sendEmailFoCreateTask(task);

    return { task: task, user: mail.user, email: mail.email, html: mail.html };
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (portal, id) => {
    //req.params.id
    var task = await Task(connect(DB_CONNECTION, portal)).findByIdAndDelete(id); // xóa mẫu công việc theo id
    return task;
}

/**
 * get subtask
 */
exports.getSubTask = async (portal, taskId) => {
    var task = await Task(connect(DB_CONNECTION, portal)).find({
        parent: taskId
    }).sort("createdAt")

    return task;
}

/**
 * get task by user
 * @param {*} data 
 */

exports.getTasksByUser = async (portal, data) => {
    var tasks = [];
    if (data.data == "user") {
        tasks = await Task(connect(DB_CONNECTION, portal)).find({
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
            var organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ _id: data.organizationUnitId[i] })
            var test = await Task(connect(DB_CONNECTION, portal)).find(
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
exports.getAllTaskOfOrganizationalUnit = async (portal, roleId, organizationalUnitId, month) => {
    let organizationalUnit, tasksOfOrganizationalUnit;
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
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ '_id': organizationalUnitId });
    }

    if (organizationalUnit) {
        tasksOfOrganizationalUnit = await Task(connect(DB_CONNECTION, portal)).aggregate([
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

            {
                $lookup: {
                    from: "organizational_units",
                    localField: "organizationalUnit",
                    foreignField: "_id",
                    as: "detailOrganizationalUnit"
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "responsibleEmployees",
                    foreignField: "_id",
                    as: "responsibleEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "accountableEmployees",
                    foreignField: "_id",
                    as: "accountableEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "consultedEmployees",
                    foreignField: "_id",
                    as: "consultedEmployeesInfo"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "informedEmployees",
                    foreignField: "_id",
                    as: "informedEmployeesInfo"
                }
            },

            {
                $project: {
                    'name': 1,
                    'detailOrganizationalUnit.name': 1,
                    'description': 1,
                    'startDate': 1,
                    'endDate': 1,
                    'priority': 1,
                    'evaluations': 1,

                    'responsibleEmployees': 1,
                    'accountableEmployees': 1,
                    'consultedEmployees': 1,
                    'informedEmployees': 1,

                    'responsibleEmployeesInfo._id': 1,
                    'responsibleEmployeesInfo.name': 1,
                    'responsibleEmployeesInfo.email': 1,

                    'accountableEmployeesInfo._id': 1,
                    'accountableEmployeesInfo.name': 1,
                    'accountableEmployeesInfo.email': 1,

                    'consultedEmployeesInfo._id': 1,
                    'consultedEmployeesInfo.name': 1,
                    'consultedEmployeesInfo.email': 1,

                    'informedEmployeesInfo._id': 1,
                    'informedEmployeesInfo.name': 1,
                    'informedEmployeesInfo.email': 1,
                    'status': 1
                }
            }
        ])
    }

    return tasksOfOrganizationalUnit;
}

/**
 * Lấy tất cả task của các đơn vị con của đơn vị hiện tại 
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
exports.getAllTaskOfChildrenOrganizationalUnit = async (portal, roleId, month, organizationalUnitId) => { // companyId, 

    let tasksOfChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, roleId, organizationalUnitId); // companyId, 

    if (childrenOrganizationalUnits) {
        for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
            tasksOfChildrenOrganizationalUnit.push(await this.getAllTaskOfOrganizationalUnit(portal, roleId, childrenOrganizationalUnits[i].id, month));
            tasksOfChildrenOrganizationalUnit[i].unshift({ 'name': childrenOrganizationalUnits[i].name, 'deg': childrenOrganizationalUnits[i].deg })
        }
    }

    return tasksOfChildrenOrganizationalUnit;
}

exports.sendEmailCheckTaskLastMonth = async () => {
    let company = await Company(connect(DB_CONNECTION, portal)).find({});
    company = company.map(x => x._id);
    let consultedTasks = [], informedTasks = [], responsibleTasks = [], accountedTasks = [];
    let taskExpire = [], taskDeadlinecoming = [];
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    for (let i in company) {

        let user = await User(connect(DB_CONNECTION, portal)).find({ company: company[i] });  // lay ra tat ca nguoi dung trong tung cong ty
        let userId = user.map(x => x._id);
        let email = user.map(x => x.email);

        for (let j in userId) {
            let flag = false;
            let tasks = { "data": "user", "userId": userId[j] };
            let tasksByUser = await this.getTasksByUser(portal, tasks); // laay ra tat ca cong viec cua nguoi dung
            tasks = { "organizationalUnit": "[]", "number": 1, "perPage": 1000, "status": "[]", "priority": "[]", "special": "[]", "name": null, "startDate": null, "endDate": null, "startDateAfter": null, "endDateBefore": null, "aPeriodOfTime": false, "user": userId[j] }

            informedTasks = await this.getPaginatedTasksThatUserHasInformedRole(portal, tasks);
            // informedTasks = await Task(connect(DB_CONNECTION, portal)).find({informedEmployees: userId[j] , isArchived: false}).populate({ path: "organizationalUnit creator parent" });
            consultedTasks = await this.getPaginatedTasksThatUserHasConsultedRole(portal, tasks);
            responsibleTasks = await this.getPaginatedTasksThatUserHasResponsibleRole(portal, tasks);
            accountedTasks = await this.getPaginatedTasksThatUserHasAccountableRole(portal, tasks);

            // xu ly voi moi nguoi dung
            let infTasks = informedTasks && informedTasks.tasks;
            let accTasks = accountedTasks && accountedTasks.tasks;
            let resTasks = responsibleTasks && responsibleTasks.tasks;
            let conTasks = consultedTasks && consultedTasks.tasks;
            let allTasks = [], notLinkedTasks = [], taskList;

            // xu ly task not link
            if (accTasks && resTasks && infTasks && conTasks) {
                taskList = allTasks.concat(accTasks, resTasks, conTasks, infTasks);
            }
            if (taskList) {
                let inprocessTask = taskList.filter(task => task.status === "Inprocess");

                let distinctTasks = [];
                for (let k in inprocessTask) {     // lọc task trùng nhau
                    let check = false;
                    for (let z in distinctTasks) {

                        if (JSON.stringify(inprocessTask[k]._id) === JSON.stringify(distinctTasks[z]._id)) {
                            check = true
                            break;
                        }
                    }
                    if (!check) distinctTasks.push(inprocessTask[k])
                }

                distinctTasks.length && distinctTasks.map(x => {
                    let evaluations;
                    let currentEvaluate = [];

                    evaluations = x.evaluations.length && x.evaluations;
                    if (evaluations) {
                        for (let i in evaluations) {
                            let month = evaluations[i].date.slice(5, 7);
                            let year = evaluations[i].date.slice(0, 4);

                            if (month == currentMonth && year == currentYear) {
                                currentEvaluate.push(evaluations[i]);
                            }
                        }
                    }

                    if (currentEvaluate.length === 0) {
                        notLinkedTasks.push(x);
                        flag = true;
                    } else {
                        let break1 = false;
                        let add = true;
                        if (currentEvaluate.length !== 0) {
                            for (let i in currentEvaluate) {
                                if (currentEvaluate[i].results.length !== 0) {
                                    for (let j in currentEvaluate[i].results) {
                                        let res = currentEvaluate[i].results[j];
                                        console.log(typeof res.employee);
                                        if (res.employee === userId[j]) {
                                            add = false;
                                            if (res.kpis.length === 0) {
                                                notLinkedTasks.push(x);
                                                break1 = true
                                            }
                                        };
                                        if (break1) break;
                                    }
                                    if (break1) break;
                                    if (add) {
                                        notLinkedTasks.push(x);
                                        flag = true;
                                    }
                                }
                            }
                        }
                    }
                })
            }


            // xu ly Action not evaluated
            var TaskHasActionsAccountable = [];
            var TaskHasActionsResponsible = [];

            if (accTasks) {
                let inprocessAccountableTask = accTasks.filter(task => task.status === "Inprocess")
                inprocessAccountableTask.length && inprocessAccountableTask.map(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    if (taskActions.length !== 0) {
                        for (let i in taskActions) {
                            let month = taskActions[i].createdAt;
                            let year = taskActions[i].createdAt;
                            month = JSON.stringify(month);
                            year = JSON.stringify(year);
                            month = Number(month.slice(6, 8));
                            year = Number(year.slice(1, 5));
                            if (month === currentMonth && year === currentYear) {
                                if (taskActions[i].rating == -1) {
                                    TaskHasActionsAccountable.push(x);
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }

                })
            }
            if (resTasks) {
                let inprocessResponsibleTasks = resTasks.filter(task => task.status === "Inprocess")
                inprocessResponsibleTasks.length && inprocessResponsibleTasks.map(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    if (taskActions.length !== 0) {
                        for (let i in taskActions) {
                            let month = taskActions[i].createdAt;
                            let year = taskActions[i].createdAt;
                            month = JSON.stringify(month);
                            year = JSON.stringify(year);
                            month = Number(month.slice(6, 8));
                            year = Number(year.slice(1, 5));
                            if (month == currentMonth && year == currentYear) {
                                if (taskActions[i].rating == -1) {
                                    TaskHasActionsResponsible.push(x);
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }

                })
            }
            let taskHasActions = [];
            taskHasActions = taskHasActions.concat(TaskHasActionsAccountable, TaskHasActionsResponsible);
            if (tasksByUser.expire.length !== 0) {
                flag = true;
            }
            if (tasksByUser.deadlineincoming.length !== 0) {
                flag = true;
            }
            if (flag) {  // gui email
                let userEmail = [email[j]];
                userEmail.push("trinhhong102@gmail.com");
                let html = `<h1>Thông báo danh sách công việc tháng ${new Date().getMonth() + 1} </h1> ` +
                    `<h3>Thông tin công việc</h3>` +
                    `${tasksByUser.expire.length > 0 ? `<p>Công việc quá hạn</p> ` +
                        `<ul>${tasksByUser.expire.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item.task._id}" target="_blank">${item.task.name}</a></li>`
                        })}
                                </ul>` : ''}` +
                    `${tasksByUser.deadlineincoming.length > 0 ? `<p>Công việc sắp hết hạn</p> ` +
                        `<ul>${tasksByUser.deadlineincoming.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item.task._id}" target="_blank">${item.task.name}</a></li>`
                        })}
                                </ul>` : ""}` +
                    `${notLinkedTasks.length > 0 ? `<p>Công việc chưa được liên kết KPI tháng</p> ` +
                        `<ul>${notLinkedTasks.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item._id}" target="_blank">${item.name}</a></li>`
                        })}
                                </ul>` : ""}` +
                    `${taskHasActions.length > 0 ? `<p>Công việc có hoạt động chưa đánh giá</p> ` +
                        `<ul>${taskHasActions.map((item) => {
                            return `<li><a href="${process.env.WEBSITE}/task?taskId=${item._id}" target="_blank">${item.name}</a></li>`
                        })}
                                </ul>` : ""}`
                    ;
                sendEmail(userEmail, "Thông báo danh sách công việc", '', html);
            }
        }
    }
    // }
}