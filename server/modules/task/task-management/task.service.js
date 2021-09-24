const mongoose = require("mongoose");
const moment = require("moment");
const { Task, TaskTemplate, OrganizationalUnit, User, Company, UserRole, Role } = require('../../../models');
const OrganizationalUnitService = require(`../../super-admin/organizational-unit/organizationalUnit.service`);
const overviewService = require(`../../kpi/employee/management/management.service`);

const { sendEmail } = require(`../../../helpers/emailHelper`);
const { connect } = require(`../../../helpers/dbHelper`);
const cloneDeep = require('lodash/cloneDeep');

/**
 * Lấy tất cả công việc theo id mẫu công việc thỏa mãn điều kiện
 * @param {*} data 
 */
exports.getTaskEvaluations = async (portal, data) => {
    // Lấy data tu client gui trong body
    let {
        organizationalUnit,
        taskTemplate,
        status, startDate,
        endDate, frequency,
        responsibleEmployees,
        accountableEmployees
    } = data;

    let startTime, start, endTime, end, filterDate = {};
    status = Number(data.status);

    // Convert startDate từ string sang date
    startTime = startDate.split("-");
    start = new Date(startTime[2], startTime[1] - 1, startTime[0]);

    // Convert endDate từ string sang date
    endTime = endDate.split("-");
    end = new Date(endTime[2], endTime[1] - 1, endTime[0]);
    if (responsibleEmployees) {
        responsibleEmployees = data.responsibleEmployees;
    }

    if (accountableEmployees) {
        accountableEmployees = data.accountableEmployees;
    }

    if (status === 0) {
        status = '';
    } else if (status === 1) {
        status = "finished";
    } else if (status === 2) {
        status = "inprocess";
    }

    // Lọc nếu ngày bắt đầu và kết thức có giá trị
    if (startDate && endDate) {
        filterDate = {
            $match: {
                evaluatingMonth: { $gte: start, $lte: end }
            }
        }
    }

    // Lọc nếu có ngày bắt đầu, không có ngày kết thúc 
    if (startDate && !endDate) {
        filterDate = {
            $match: {
                evaluatingMonth: { $gte: start }
            }
        }
    }

    // Mặc định điều kiện lọc là : Đơn vị, mẫu công việc, thống kê đánh giá từ ngày
    let condition = [
        { $match: { organizationalUnit: mongoose.Types.ObjectId(organizationalUnit) } },
        { $match: { taskTemplate: mongoose.Types.ObjectId(taskTemplate) } },
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
        filterDate,

    ];

    // Lọc theo trạng thái công việc 'Tất cả', không có người phê duyệt và người thực hiện
    if (status === '' && !responsibleEmployees && !accountableEmployees) { // Lọc tất cả các coong việc không theo đặc thù
        condition = [
            ...condition,
        ]
    }

    // Lọc theo trạng thái công việc 'Tất cả', có người phê duyệt và người thực hiện
    else if (status === '' && responsibleEmployees && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]

    }

    // Lọc theo trạng thái công việc 'Tất cả', có người thực hiện
    else if (status === '' && responsibleEmployees) {
        condition = [
            ...condition,
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Tất cả', có người phê duyệt
    else if (status === '' && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', không có người phê duyệt và người thực hiện
    else if (status !== '' && !responsibleEmployees && !accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người phê duyệt và người thực hiện
    else if (status !== '' && responsibleEmployees && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người thực hiện.
    else if (status !== '' && responsibleEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { responsibleEmployees: { $elemMatch: { _id: { $in: [...responsibleEmployees.map(x => mongoose.Types.ObjectId(x.toString()))] } } } } },
        ]
    }

    // Lọc theo trạng thái công việc 'Hoàn thành hoặc đang thực hiện', có người phê duyệt.
    else if (status !== '' && accountableEmployees) {
        condition = [
            ...condition,
            { $match: { status: status } },
            { $match: { accountableEmployees: { $elemMatch: { _id: { $in: [...accountableEmployees.map(y => mongoose.Types.ObjectId(y.toString()))] } } } } },
        ]
    }


    let result = await Task(connect(DB_CONNECTION, portal)).aggregate(condition); // kết quả sau khi truy vấn mongodb
    // lấy danh sachs điều kiện lọc của trường thông tin của công việc, vì dữ liệu gửi trong query là dạng string nên phải parse sang đối tượng
    if (data.taskInformations) { // Bắt lỗi trường hợp chọn mẫu công việc, nhưng mãu đấy không có các trường thông tin và ấn nút xem biểu đồ
        let taskInformations = data.taskInformations, listDataChart = [], configurations = [];
        if (data.itemListBoxRight) {
            listDataChart = data.itemListBoxRight;
            listDataChart = listDataChart.map(item => JSON.parse(item));
        }

        taskInformations = taskInformations.map(item => JSON.parse(item));

        // Lấy các điều kiện lọc của các trường thông tin từ client gửi về.
        for (let [index, value] of taskInformations.entries()) { // tương tự for in. (for of sử dụng Array entries function get index)
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
            // taskMerge.map(item => {
            //     if (item.filter) {
            //         let replacer = new RegExp(item.code, 'g')
            //         item.filter = eval(item.filter.replace(replacer, item.value));
            //     } else {
            //         item.filter = true;
            //     }
            //     return item;
            // })
            return { // Lấy các trường cần thiết
                _id: item._id,
                name: item.name,
                accountableEmployees: item.accountableEmployees,
                responsibleEmployees: item.responsibleEmployees,
                status: item.status,
                date: item.evaluatingMonth,
                startDate: item.startDate,
                endDate: item.endDate,
                priority: item.priority,
                frequency: frequency,
                taskInformations: taskMerge,
                results: item.results,
                dataForAxisXInChart: listDataChart,
            };
        });

        // console.log("newResult",newResult);
        // newResult.map(o => {
        //     if (o.taskInformations.some(item => (item.filter === true))) {
        //         return o;
        //     } else {
        //         newResult = [];
        //     }
        // })
        return newResult;
    } else {
        return result;
    }
}


/**
 * Lấy công việc theo người dùng ,...$_id
 * @task dữ liệu trong params
 */
exports.getPaginatedTasks = async (portal, task) => {
    let { perPage, number, role, user, organizationalUnit, status, priority, special, name,
        startDate, endDate, startDateAfter, endDateBefore, responsibleEmployees,
        accountableEmployees, creatorEmployees, creatorTime, projectSearch, tags } = task;
    let taskList;
    perPage = Number(perPage);
    let page = Number(number);
    let roleArr = [];
    if (Array.isArray(role) && role.length > 0) {
        for (let i in role) {
            if (role[i] === "responsible") roleArr.push({ responsibleEmployees: { $in: [user] } });
            if (role[i] === "accountable") roleArr.push({ accountableEmployees: { $in: [user] } });
            if (role[i] === "consulted") roleArr.push({ consultedEmployees: { $in: [user] } });
            if (role[i] === "informed") roleArr.push({ informedEmployees: { $in: [user] } });
            if (role[i] === "creator") roleArr.push({ creator: { $in: [user] } });
        }
    } else {
        roleArr = [
            { responsibleEmployees: { $in: [user] } },
            { accountableEmployees: { $in: [user] } },
            { consultedEmployees: { $in: [user] } },
            { informedEmployees: { $in: [user] } },
            { creator: { $in: [user] } },
        ];
    }


    let keySearch = {
        $or: roleArr,
        isArchived: false
    };
    let keySearchSpecial = {}, keySeachDateTime = {}, keyTags = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else if (special[i] === "request_to_close") {
                keySearch = {
                    ...keySearch,
                    "requestToCloseTask.requestStatus": 1,
                    status: {
                        $in: ["inprocess"],
                    },
                    $or: [
                        { accountableEmployees: { $in: [user] } }
                    ]
                }
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    // Tìm kiếm theo người thực hiện
    if (responsibleEmployees) {
        const responsible = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdResponsible = responsible && responsible.length > 0 ? responsible.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            responsibleEmployees: {
                $in: getIdResponsible
            }
        }
    }

    // Tìm kiếm theo người phê duyệt
    if (accountableEmployees) {
        const accountable = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }
            ]
        })
        const getIdAccountable = accountable && accountable.length > 0 ? accountable.map(o => o._id) : [];
        keySearch = {
            ...keySearch,
            accountableEmployees: {
                $in: getIdAccountable
            }
        }
    }

    // Tìm kiếm theo người thiết lập
    if (creatorEmployees) {
        const creator = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = creator && creator.length > 0 ? creator.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            creator: {
                $in: getIdCreator
            }
        }
    }

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySearch = {
            ...keySearch,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    // tìm kiếm công việc theo dự án
    if (projectSearch && projectSearch.length > 0) {
        keySearch = {
            ...keySearch,
            taskProject: {
                $in: projectSearch,
            }
        }
    }

    // Tìm kiếm công việc theo ngày tạo tuần hiện tại
    if (creatorTime && creatorTime === "currentWeek") {
        let curr = new Date()
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }

        const firstDayOfWeek = week[0];
        const lastDayOfWeek = week[week.length - 1];

        keySearch = {
            ...keySearch,
            createdAt: {
                $gte: new Date(firstDayOfWeek), $lte: new Date(lastDayOfWeek)
            }
        }
    }

    // tìm kiếm công việc theo ngày tạo tháng hiện tại
    if (creatorTime && creatorTime === 'currentMonth') {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const month = new Date(currentYear + '-' + (currentMonth + 1));
        const nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        keySearch = {
            ...keySearch,
            createdAt: {
                $gt: new Date(month), $lte: new Date(nextMonth)
            }
        }
    }

    if (tags?.length > 0) {
        let textSearch = ""
        tags.map(item => {
            textSearch = textSearch + " " + item
        })

        keyTags = {
            ...keyTags,
            $text: { $search: textSearch.trim() }
        }
    }

    let optionQuery = {
        $and: [
            keySearch,
            keySeachDateTime,
            keySearchSpecial,
            keyTags
        ]
    }

    taskList = await Task(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage).populate([
            { path: "organizationalUnit parent" },
            { path: 'creator', select: "_id name email avatar" },
            { path: 'responsibleEmployees', select: "_id name email avatar" },
            { path: 'accountableEmployees', select: "_id name email avatar" },
            { path: "timesheetLogs.creator", select: "name" },
        ]);

    let totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(optionQuery);
    let totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": taskList,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy công việc thực hiện chính theo id người dùng
 * @task dữ liệu trong params
 */
exports.getPaginatedTasksThatUserHasResponsibleRole = async (portal, task) => {
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
    let keySearchSpecial = {}, keySeachDateTime = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }


    responsibleTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })


    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": responsibleTasks,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy công việc phê duyệt theo id người dùng
 * @task dữ liệu từ params
 */
exports.getPaginatedTasksThatUserHasAccountableRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = task;

    var accountableTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        accountableEmployees: {
            $in: [user]
        },
        isArchived: false
    };
    let keySearchSpecial = {}, keySeachDateTime = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    accountableTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: 'creator', select: "_id name  email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy công việc tư vấn theo id người dùng
 */
exports.getPaginatedTasksThatUserHasConsultedRole = async (portal, task) => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = task;

    var consultedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        consultedEmployees: {
            $in: [user]
        },
        isArchived: false
    };
    let keySearchSpecial = {}, keySeachDateTime = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    consultedTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: " creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": consultedTasks,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy công việc thiết lập theo id người dùng
 */
exports.getPaginatedTasksCreatedByUser = async (portal, task) => {
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
    let keySearchSpecial = {}, keySeachDateTime = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    creatorTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });
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
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = task;

    var informedTasks;
    var perPage = Number(perPage);
    var page = Number(number);

    var keySearch = {
        informedEmployees: {
            $in: [user]
        },
        isArchived: false
    };
    let keySearchSpecial = {}, keySeachDateTime = {};

    if (organizationalUnit) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnit,
            }
        };
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
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

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }


    informedTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })


    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": informedTasks,
        "totalPage": totalPages,
        totalCount
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksByUser = async (portal, task, type = "paginated_task_by_user") => {
    var { perPage, page, user, organizationalUnit, status, priority, special, name,
        startDate, endDate, responsibleEmployees, tags,
        accountableEmployees, creatorEmployees, organizationalUnitRole
    } = task;
    var tasks;
    var perPage = Number(perPage);
    var page = Number(page);
    var keySearch;

    if (type === "paginated_task_by_user") {
        keySearch = {
            $or: [
                { informedEmployees: { $in: [user] } },
                { creator: { $in: [user] } },
                { responsibleEmployees: { $in: [user] } },
                { consultedEmployees: { $in: [user] } },
                { accountableEmployees: { $in: [user] } },
            ],
            isArchived: false
        };
    }
    else if (type === "paginated_task_by_unit") {
        keySearch = {
            isArchived: false
        };
    }

    // Tìm kiếm theo người thực hiện
    if (responsibleEmployees) {
        const responsible = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: responsibleEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdResponsible = responsible && responsible.length > 0 ? responsible.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            responsibleEmployees: {
                $in: getIdResponsible
            }
        }
    }

    // Tìm kiếm theo người phê duyệt
    if (accountableEmployees) {
        const accountable = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: accountableEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdAccountable = accountable && accountable.length > 0 ? accountable.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            accountableEmployees: {
                $in: getIdAccountable
            }
        }
    }

    // Tìm kiếm theo người thiết lập
    if (creatorEmployees) {
        const creator = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                {
                    name: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }, {
                    email: {
                        $regex: creatorEmployees,
                        $options: "i",
                    }
                }
            ]
        })

        const getIdCreator = creator && creator.length > 0 ? creator.map(o => o._id) : [];

        keySearch = {
            ...keySearch,
            creator: {
                $in: getIdCreator
            }
        }
    }


    let keySearchSpecial = {}, keySeachDateTime = {}, keyTags = {};

    if (organizationalUnit) {
        if (type === "paginated_task_by_unit") {
            if (organizationalUnitRole?.length === 1) {
                if (organizationalUnitRole?.[0] === 'management') {
                    keySearch = {
                        ...keySearch,
                        organizationalUnit: { $in: organizationalUnit },
                    };
                } else if (organizationalUnitRole?.[0] === 'collabration') {
                    keySearch = {
                        ...keySearch,
                        "collaboratedWithOrganizationalUnits.organizationalUnit": { $in: organizationalUnit },
                    };
                }
            } else {
                keySearch = {
                    ...keySearch,
                    $or: [
                        { organizationalUnit: { $in: organizationalUnit } },
                        { "collaboratedWithOrganizationalUnits.organizationalUnit": { $in: organizationalUnit } },
                    ],
                };
            }
        } else {
            keySearch = {
                ...keySearch,
                organizationalUnit: {
                    $in: organizationalUnit,
                }
            };
        }
    }

    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            }
        };
    }

    if (priority) {
        keySearch = {
            ...keySearch,
            priority: {
                $in: priority,
            }
        };
    }

    if (special) {
        for (let i = 0; i < special.length; i++) {
            if (special[i] === "stored") {
                keySearch = {
                    ...keySearch,
                    isArchived: true
                };
            }
            else if (special[i] === "currentMonth") {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let month = new Date(currentYear + '-' + (currentMonth + 1));
                let nextMonth = new Date(currentYear + '-' + (currentMonth + 1));
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lt: nextMonth, $gte: month } },
                        { 'startDate': { $lt: nextMonth, $gte: month } },
                        { $and: [{ 'endDate': { $gte: nextMonth } }, { 'startDate': { $lt: month } }] }
                    ]
                }
            } else if (special[i] === "assigned" && !special.includes("not_assigned")) {
                keySearch = {
                    ...keySearch,
                    collaboratedWithOrganizationalUnits: {
                        $elemMatch: {
                            "organizationalUnit": organizationalUnit,
                            "isAssigned": JSON.parse(1)
                        }
                    }
                }
            } else if (special[i] === "not_assigned" && !special.includes("assigned")) {
                keySearch = {
                    ...keySearch,
                    collaboratedWithOrganizationalUnits: {
                        $elemMatch: {
                            "organizationalUnit": organizationalUnit,
                            "isAssigned": JSON.parse(0)
                        }
                    }
                }
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


    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }
    else if (startDate) {
        startDate = new Date(startDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, startDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, startDate.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (endDate) {
        endDate = new Date(endDate);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, endDate.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, endDate.getFullYear()]
                    }
                }
            ]
        }
    }

    if (tags?.length > 0) {
        let textSearch = ""
        tags.map(item => {
            textSearch = textSearch + " " + item
        })

        keyTags = {
            ...keyTags,
            $text: { $search: textSearch.trim() }
        }
    }

    console.log(keyTags)
    tasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime,
            keyTags
        ]
    }).sort({ 'createdAt': -1 })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit parent " })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })
        .populate({ path: "accountableEmployees", select: "_id name email avatar" })


    let totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySeachDateTime
        ]
    });

    let totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": tasks,
        "totalPage": totalPages,
        totalCount
    };
}

/** Tìm kiếm công việc theo đơn vị */
exports.getPaginatedTasksByOrganizationalUnit = async (portal, task, type) => {
    return await this.getPaginatedTasksByUser(portal, task, type);
}

/**
 * Lấy công việc theo id đơn vị
 * @task dữ liệu từ params
 */
exports.getAllTaskOfOrganizationalUnitByMonth = async (portal, task) => { //nguyen
    let { organizationalUnitId, startMonth, endMonth } = task;
    let organizationUnitTasks;
    let keySearch = {};

    if (organizationalUnitId) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }

    let startDate = new Date(startMonth);
    let endDate = new Date(endMonth);
    endDate.setMonth(endDate.getMonth() + 1);

    if (startDate && endDate) {
        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': -1 })
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })
    return {
        "tasks": organizationUnitTasks
    };
}

exports.getPercentExpire = (nowDate, startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    // lấy khoảng thời gian làm việc
    let workingTime = Math.round((end - start) / 1000 / 60 / 60 / 24);
    // tính phần trăm phải làm trong ngày
    let percentOneDay = 100 / workingTime;
    // Tính số ngày quá hạn
    let deadline2 = Math.round((nowDate - end) / 1000 / 60 / 60 / 24);
    // tính phần trăm chậm tiến độ. số ngày quá hạn nhân với phần trăm phải làm trong 1 ngày
    return percentOneDay * deadline2;
}

exports.getPercent = (nowDate, startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    // lấy khoảng thời gian làm việc
    let workingTime = Math.round((end - start) / 1000 / 60 / 60 / 24);
    // lấy khoản thời gian làm việc tính đến ngày hiện tại
    // tính phần trăm phải làm trong 1 ngày
    let percentOneDay = 100 / workingTime;
    // % tiến độ tối thiểu phải làm được trong time hiện tại
    let workingTimeNow = Math.round((nowDate - start) / 1000 / 60 / 60 / 24);
    return workingTimeNow * percentOneDay;
}

exports.getAllTaskByPriorityOfOrganizationalUnit = async (portal, task) => {
    const { organizationalUnitId, date } = task;
    let keySearch = {
        status: "inprocess",
        isArchived: false
    };
    if (organizationalUnitId) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }
    const data = await Task(connect(DB_CONNECTION, portal)).find({ ...keySearch, endDate: { $gte: new Date(date) } }) // lấy những việc còn thời hạn
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })
        .lean();

    let taskUrgent = [], taskNeedToDo = [];
    const nowDate = new Date();

    // Lấy công việc khẩn cấp
    data.forEach((obj, index) => {
        let minimumWorkingTime = this.getPercent(nowDate, obj.startDate, obj.endDate);
        let percentDifference = minimumWorkingTime - obj.progress;
        if (obj.priority === 1 && obj.progress < minimumWorkingTime && percentDifference >= 50) {
            taskUrgent = [...taskUrgent, obj]
        }
        if (obj.priority === 2 && obj.progress < minimumWorkingTime && percentDifference >= 40) {
            taskUrgent = [...taskUrgent, obj]
        }
        if (obj.priority === 3 && obj.progress < minimumWorkingTime && percentDifference >= 30) {
            taskUrgent = [...taskUrgent, obj]
        }
        if (obj.priority === 4 && obj.progress < minimumWorkingTime && percentDifference >= 20) {
            taskUrgent = [...taskUrgent, obj];
        }
        if (obj.priority === 5 && obj.progress < minimumWorkingTime && percentDifference >= 10) {
            taskUrgent = [...taskUrgent, obj];
        }
    })

    // lấy công việc cần làm
    data.forEach(obj => {
        let minimumWorkingTime = this.getPercent(nowDate, obj.startDate, obj.endDate);
        let percentDifference = minimumWorkingTime - obj.progress;
        if (obj.priority === 5 && obj.progress < minimumWorkingTime && 0 < percentDifference && percentDifference < 10) {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
        if (obj.priority === 4 && obj.progress < minimumWorkingTime && 10 < percentDifference && percentDifference < 20) {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
        if (obj.priority === 3 && obj.progress < minimumWorkingTime && 20 < percentDifference && percentDifference < 30) {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
        if (obj.priority === 2 && obj.progress < minimumWorkingTime && 30 < percentDifference && percentDifference < 40) {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
        if (obj.priority === 1 && obj.progress < minimumWorkingTime && 40 < percentDifference && percentDifference < 50) {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
    })

    if (date) {
        keySearch = {
            ...keySearch,
            endDate: {
                $lt: new Date(date)
            }
        }
    }
    // lấy việc quá hạn
    const tasksExpire = await Task(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })
        .lean();
    let tasksExpireUrgent = [];

    // Quá hạn (cv cấp 1, 2, 3, 4, 5 :25 %, 20%, 15%,10%, 5% số ngày đã quá )
    tasksExpire.forEach(obj => {
        let delay = this.getPercentExpire(nowDate, obj.startDate, obj.endDate);
        if (obj.priority === 1 && delay > 25) {
            tasksExpireUrgent = [...tasksExpireUrgent, obj];
        } else if (obj.priority === 2 && delay > 20) {
            tasksExpireUrgent = [...tasksExpireUrgent, obj];
        } else if (obj.priority === 3 && delay > 15) {
            tasksExpireUrgent = [...tasksExpireUrgent, obj];
        } else if (obj.priority === 4 && delay > 10) {
            tasksExpireUrgent = [...tasksExpireUrgent, obj];
        } else if (obj.priority === 5 && delay > 5) {
            tasksExpireUrgent = [...tasksExpireUrgent, obj];
        } else {
            taskNeedToDo = [...taskNeedToDo, obj];
        }
    })
    /* Quá hạn:quá deanline
    (cv cấp 1, 2, 3, 4, 5 :25 %, 20%, 15%,10%, 5% số ngày đã quá )
    hoặc
    cv Ưu tiên 1, 2 , 3, 4, 5 chậm tiến độ quá >=50, >=40,  >=30%, 4: >=20%, 5: >=10%
    */
    taskUrgent = [...taskUrgent, ...tasksExpireUrgent];

    /*quá hạn ko có ở khẩn cấp 
    hoặc
    chậm tiến độ của mức 5 , 4, 3, 2, 1: 5- 0<x<10, 4: 10 <= x <20, 3: 20<x<30, 2: 30<x<40 ,1: 40<x<50: */

    return {
        "urgent": taskUrgent,
        "taskNeedToDo": taskNeedToDo,
    };
}

/**
 * Gửi email khi tạo mới công việc
 * @param {*} portal id công ty
 * @param {*} task công việc vừa tạo
 */
exports.sendEmailForCreateTask = async (portal, task) => {
    task = await task.populate("organizationalUnit parent")
        .populate({ path: "creator", select: "_id name email avatar" })
        .execPopulate();

    var email, userId, user, users, userIds
    var managersOfOrganizationalUnitThatHasCollaboratedId = [], managersOfOrganizationalUnitThatHasCollaborated, collaboratedHtml, collaboratedEmail;

    var resId = task.responsibleEmployees;  // lấy id người thực hiện
    var res = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: resId } });
    // res = res.map(item => item.name);
    userIds = resId;
    var accId = task.accountableEmployees;  // lấy id người phê duyệt
    var acc = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: accId } });
    userIds.push(...accId);

    var conId = task.consultedEmployees;  // lấy id người tư vấn
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

    // Lấy id trưởng phòng các đơn vị phối hợp
    for (let i = 0; i < task.collaboratedWithOrganizationalUnits.length; i++) {
        let unit = task.collaboratedWithOrganizationalUnits[i] && await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findById(task.collaboratedWithOrganizationalUnits[i].organizationalUnit)

        unit && unit.managers.map(item => {
            managersOfOrganizationalUnitThatHasCollaboratedId.push(item);
        })
    }

    managersOfOrganizationalUnitThatHasCollaborated = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: managersOfOrganizationalUnitThatHasCollaboratedId }
        })
        .populate("userId")
    user = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIds }
    })

    email = user.map(item => item.email); // Lấy ra tất cả email của người dùng
    collaboratedEmail = managersOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId.email) // Lấy email trưởng đơn vị phối hợp 

    var body = `<a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank" title="${process.env.WEBSITE}/task?taskId=${task._id}"><strong>${task.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        // `<p>Tên công việc : <strong>${task.name}</strong></p>` +
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
    var html = `<p>Bạn có công việc mới: ` + body;
    collaboratedHtml = `<p>Đơn vị bạn được phối hợp thực hiện công việc mới: ` + body;


    return {
        task: task,
        user: userIds, email: email, html: html,
        managersOfOrganizationalUnitThatHasCollaborated: managersOfOrganizationalUnitThatHasCollaborated.map(item => item.userId && item.userId._id),
        collaboratedEmail: collaboratedEmail, collaboratedHtml: collaboratedHtml
    };
}

/**
 * Tạo công việc mới
 */
exports.createTask = async (portal, task) => {
    // Lấy thông tin công việc liên quan
    var level = 1;
    if (mongoose.Types.ObjectId.isValid(task.parent)) {
        var parent = await Task(connect(DB_CONNECTION, portal)).findById(task.parent);
        if (parent) level = parent.level + 1;
    }

    var startDate, endDate;
    if (Date.parse(task.startDate)) startDate = new Date(task.startDate);
    else {
        var splitter = task.startDate.split("-");
        startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    if (Date.parse(task.endDate)) endDate = new Date(task.endDate);
    else {
        var splitter = task.endDate.split("-");
        endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate) {
        taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findById(task.taskTemplate);
        let taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    let formula;
    if (task.formula) {
        formula = task.formula;
    } else {
        if (taskTemplate) {
            formula = taskTemplate.formula;
        } else if (task.formula) {
            formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100"
        }
    }

    let getValidObjectId = (value) => {
        return mongoose.Types.ObjectId.isValid(value) ? value : undefined;
    }
    let taskProject = (taskTemplate && taskTemplate.taskProject) ? getValidObjectId(taskTemplate.taskProject) : getValidObjectId(task.taskProject);

    let taskActions = [];
    if (task.taskActions) {
        taskActions = task.taskActions.map(e => {
            return {
                mandatory: e.mandatory,
                name: e.name,
                description: e.description,
            }
        });
    } else {
        taskActions = taskTemplate ? cloneActions : [];
    }

    let taskInformations = [];
    if (task.taskInformations) {
        taskInformations = task.taskInformations.map(e => {
            return {
                filledByAccountableEmployeesOnly: e.filledByAccountableEmployeesOnly,
                code: e.code,
                name: e.name,
                description: e.description,
                type: e.type,
                extra: e.extra,
            }
        });
    } else {
        taskInformations = taskTemplate ? taskTemplate.taskInformations : [];
    }

    const newTask = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        collaboratedWithOrganizationalUnits: task.collaboratedWithOrganizationalUnits,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description,
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        formula: formula,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskInformations,
        taskActions: taskActions,
        parent: (task.parent === "") ? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? task.creator : [],
        taskProject,
        tags: task.tags
    });

    if (newTask.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            newTask.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }


    let mail = await this.sendEmailForCreateTask(portal, cloneDeep(newTask));

    const taskPopulate = await newTask.populate([
        { path: "organizationalUnit parent" },
        { path: 'creator', select: "_id name email avatar" },
        { path: 'responsibleEmployees', select: "_id name email avatar" },
        { path: 'accountableEmployees', select: "_id name email avatar" },
        { path: "timesheetLogs.creator", select: "name" },
    ]).execPopulate();

    return {
        task: newTask,
        taskPopulate,
        user: mail.user, email: mail.email, html: mail.html,
        managersOfOrganizationalUnitThatHasCollaborated: mail.managersOfOrganizationalUnitThatHasCollaborated,
        collaboratedEmail: mail.collaboratedEmail, collaboratedHtml: mail.collaboratedHtml
    };
}

/**
 * Tạo công việc mới của dự án
 */
exports.createProjectTask = async (portal, task) => {
    // // Lấy thông tin công việc liên quan
    // var level = 1;
    // if (mongoose.Types.ObjectId.isValid(task.parent)) {
    //     var parent = await Task(connect(DB_CONNECTION, portal)).findById(task.parent);
    //     if (parent) level = parent.level + 1;
    // }

    var startDate, endDate;
    if (Date.parse(task.startDate)) startDate = new Date(task.startDate);
    else {
        var splitter = task.startDate.split("-");
        startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    if (Date.parse(task.endDate)) endDate = new Date(task.endDate);
    else {
        var splitter = task.endDate.split("-");
        endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    }

    let taskTemplate, cloneActions = [];
    if (task.taskTemplate) {
        taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).findById(task.taskTemplate);
        let taskActions = taskTemplate.taskActions;

        for (let i in taskActions) {
            cloneActions[i] = {
                mandatory: taskActions[i].mandatory,
                name: taskActions[i].name,
                description: taskActions[i].description,
            }
        }
    }

    let formula;
    if (task.formula) {
        formula = task.formula;
    } else {
        if (taskTemplate) {
            formula = taskTemplate.formula;
        } else if (task.formula) {
            formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100"
        }
    }

    let getValidObjectId = (value) => {
        return mongoose.Types.ObjectId.isValid(value) ? value : undefined;
    }
    let taskProject = (taskTemplate && taskTemplate.taskProject) ? getValidObjectId(taskTemplate.taskProject) : getValidObjectId(task.taskProject);

    let taskActions = [];
    if (task.taskActions) {
        taskActions = task.taskActions.map(e => {
            return {
                mandatory: e.mandatory,
                name: e.name,
                description: e.description,
            }
        });
    } else {
        taskActions = taskTemplate ? cloneActions : [];
    }

    let taskInformations = [];
    if (task.taskInformations) {
        taskInformations = task.taskInformations.map(e => {
            return {
                filledByAccountableEmployeesOnly: e.filledByAccountableEmployeesOnly,
                code: e.code,
                name: e.name,
                description: e.description,
                type: e.type,
                extra: e.extra,
            }
        });
    } else {
        taskInformations = taskTemplate ? taskTemplate.taskInformations : [];
    }

    var newTask = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
        organizationalUnit: task.organizationalUnit,
        collaboratedWithOrganizationalUnits: task.collaboratedWithOrganizationalUnits,
        creator: task.creator, //id của người tạo
        name: task.name,
        description: task.description || '',
        startDate: startDate,
        endDate: endDate,
        priority: task.priority,
        formula: formula,
        taskTemplate: taskTemplate ? taskTemplate : null,
        taskInformations: taskInformations,
        taskActions: taskActions,
        // parent: (task.parent === "") ? null : task.parent,
        // level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? task.creator : [],
        taskProject,
        estimateNormalTime: task.estimateNormalTime,
        estimateOptimisticTime: task.estimateOptimisticTime,
        estimateNormalCost: task.estimateNormalCost,
        estimateMaxCost: task.estimateMaxCost,
        preceedingTasks: task.preceedingTasks,
        actorsWithSalary: task.actorsWithSalary,
        estimateAssetCost: task.estimateAssetCost,
        totalResWeight: task.totalResWeight,
        isFromCPM: task.isFromCPM,
    });

    if (newTask.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            newTask.taskTemplate, { $inc: { 'numberOfUse': 1 } }, { new: true }
        );
    }

    let mail = await this.sendEmailForCreateTask(portal, newTask);

    return {
        task: newTask,
        user: mail.user, email: mail.email, html: mail.html,
        managersOfOrganizationalUnitThatHasCollaborated: mail.managersOfOrganizationalUnitThatHasCollaborated,
        collaboratedEmail: mail.collaboratedEmail, collaboratedHtml: mail.collaboratedHtml
    };
}

/**
 * Xóa công việc
 */
exports.deleteTask = async (portal, taskId) => {
    //req.params.taskId
    taskId = taskId.split(",");
    for(let i in taskId) {
        let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId[i]);
        if (tasks.taskTemplate !== null) {
            await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
                tasks.taskTemplate, { $inc: { 'numberOfUse': -1 } }, { new: true }
            );
        }

        await Task(connect(DB_CONNECTION, portal)).findByIdAndDelete(taskId[i]); // xóa mẫu công việc theo id
    }
    return taskId;
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
            ],
            status: "inprocess"
        })
    }

    if (data.data == "organizationUnit") {
        for (let i in data.organizationUnitId) {
            let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ _id: data.organizationUnitId[i] })
            let test = await Task(connect(DB_CONNECTION, portal)).find(
                { organizationalUnit: organizationalUnit._id, status: "inprocess" },
            )

            for (let j in test) {
                tasks.push(test[j]);
            }
        }
    }



    let nowdate = new Date();
    let tasksexpire = [], deadlineincoming = [], test;
    for (let i in tasks) {
        const olddate = new Date(tasks[i].endDate);
        test = nowdate - olddate;
        if (test < 0) {
            let test2 = olddate - nowdate;
            let totalDays = Math.round(test2 / 1000 / 60 / 60 / 24);
            if (totalDays <= 7) {
                let tasktest = {
                    task: tasks[i],
                    totalDays: totalDays
                }
                deadlineincoming.push(tasktest);
            }
        } else {
            let totalDays = Math.round(test / 1000 / 60 / 60 / 24);
            let tasktest = {
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
                { 'managers': roleId },
                { 'deputyManagers': roleId },
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
                    from: "organizationalunits",
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
exports.getAllTaskOfChildrenOrganizationalUnit = async (portal, roleId, month, organizationalUnitId) => {

    let tasksOfChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, roleId, organizationalUnitId);

    if (childrenOrganizationalUnits) {
        for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
            tasksOfChildrenOrganizationalUnit.push(await this.getAllTaskOfOrganizationalUnit(portal, roleId, childrenOrganizationalUnits[i].id, month));
            tasksOfChildrenOrganizationalUnit[i].unshift({ 'name': childrenOrganizationalUnits[i].name, 'deg': childrenOrganizationalUnits[i].deg })
        }
    }

    return tasksOfChildrenOrganizationalUnit;
}

exports.sendEmailCheckTaskLastMonth = async () => {
    let company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find({});
    company = company.map(x => x._id);
    let consultedTasks = [], informedTasks = [], responsibleTasks = [], accountedTasks = [];
    let taskExpire = [], taskDeadlinecoming = [];
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    for (let i in company) {
        let portal = company.shortName;
        let user = await User(connect(DB_CONNECTION, portal)).find({ company: company[i] });  // lay ra tat ca nguoi dung trong tung cong ty
        let userId = user.map(x => x._id);
        let email = user.map(x => x.email);

        for (let j in userId) {
            let flag = false;
            let tasks = {
                data: "user",
                userId: userId[j]
            };
            let tasksByUser = await this.getTasksByUser(portal, tasks); // laay ra tat ca cong viec cua nguoi dung
            tasks = {
                organizationalUnit: [],
                number: 1,
                perPage: 1000,
                status: [],
                priority: [],
                special: [],
                name: null,
                startDate: null,
                endDate: null,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                user: userId[j]
            }

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
                let inprocessTask = taskList.filter(task => task.status === "inprocess");

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
                let inprocessAccountableTask = accTasks.filter(task => task.status === "inprocess")
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
                let inprocessResponsibleTasks = resTasks.filter(task => task.status === "inprocess")
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

/**
 * Lấy thông tin thống kê công việc của người dùng theo vai trò
 * @param {*} portal 
 * @param {*} userId 
 * @param {*} roleId 
 */
exports.getTaskAnalysOfUser = async (portal, userId, type, date) => {
    date = JSON.parse(date);
    let { firstDay, lastDay } = date;
    let keySeachDateTime = {}, keySearch = {};

    keySearch = {
        ...keySearch,
        $or: [
            { responsibleEmployees: userId }, // người thực hiện
            { accountableEmployees: userId }, // người phê duyệt
            { consultedEmployees: userId }, // người tư vấn
        ]
    }

    if (firstDay && lastDay) {
        lastDay = new Date(lastDay);
        lastDay.setMonth(lastDay.getMonth() + 1);

        keySeachDateTime = {
            ...keySeachDateTime,
            $or: [
                { 'endDate': { $lt: new Date(lastDay), $gte: new Date(firstDay) } },
                { 'startDate': { $lt: new Date(lastDay), $gte: new Date(firstDay) } },
                { $and: [{ 'endDate': { $gte: new Date(lastDay) } }, { 'startDate': { $lt: new Date(firstDay) } }] }
            ]
        }
    }
    else if (firstDay) {
        firstDay = new Date(firstDay);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$startDate" }, firstDay.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$startDate" }, firstDay.getFullYear()]
                    }
                }
            ]
        }
    }
    else if (lastDay) {
        lastDay = new Date(lastDay);

        keySeachDateTime = {
            ...keySeachDateTime,
            "$and": [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$endDate" }, lastDay.getMonth() + 1]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$endDate" }, lastDay.getFullYear()]
                    }
                }
            ]
        }
    }
    let tasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySeachDateTime
        ]
    });

    switch (type) {
        case 'priority':
            let urgent = tasks.filter(task => task.priority === 5); // các cv khẩn cấp
            let high = tasks.filter(task => task.priority === 4); // các cv cao 
            let standard = tasks.filter(task => task.priority === 3); // các cv tiêu chuẩn
            let average = tasks.filter(task => task.priority === 2); // các cv trung bình
            let low = tasks.filter(task => task.priority === 1); // các cv thấp

            return {
                urgent,
                high,
                standard,
                average,
                low
            };
        case 'status':
            let inprocess = tasks.filter(task => task.status === 'inprocess'); // các cv khẩn cấp
            let wait_for_approval = tasks.filter(task => task.status === 'wait_for_approval'); // các cv cao 
            let finished = tasks.filter(task => task.status === 'finished'); // các cv tiêu chuẩn
            let delayed = tasks.filter(task => task.status === 'delayed'); // các cv trung bình
            let canceled = tasks.filter(task => task.status === 'canceled'); // các cv thấp

            return {
                inprocess,
                wait_for_approval,
                finished,
                delayed,
                canceled
            }
        default:
            return tasks;
    }
}

/**
 * 
 * @param {Lấy lịch sử bấm giờ làm việc của người dùng theo từng tháng trong năm} portal 
 * @param {*} userId 
 * @param {*} month 
 * @param {*} year 
 */
exports.getUserTimeSheet = async (portal, userId, month, year) => {
    let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại 
    let endOfMonth = new Date(year, month); // cần chỉnh lại

    let tsl = await Task(connect(DB_CONNECTION, portal)).aggregate([
        {
            $match: {
                "timesheetLogs.creator": mongoose.Types.ObjectId(userId),
                "timesheetLogs.startedAt": { $exists: true },
                "timesheetLogs.startedAt": { $gte: beginOfMonth },
                "timesheetLogs.stoppedAt": { $exists: true },
                "timesheetLogs.stoppedAt": { $lte: endOfMonth }
            }
        },
        { $unwind: "$timesheetLogs" },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ _id: "$_id", name: "$name" }, "$timesheetLogs"] } } },

        {
            $match: {
                "creator": mongoose.Types.ObjectId(userId),
                "startedAt": { $exists: true },
                "startedAt": { $gte: beginOfMonth },
                "stoppedAt": { $exists: true },
                "stoppedAt": { $lte: endOfMonth }
            },
        },
    ]);

    return tsl;
}

/**
 * Lấy thống kê bấm giờ của tất cả các tài khoản trong hệ thống (lấy thóng kê tổng số bấm giờ hợp lệ)
 * @param {*} portal 
 * @param {*} month 
 * @param {*} year 
 */
exports.getAllUserTimeSheet = async (portal, month, year) => {
    let users = await User(connect(DB_CONNECTION, portal)).find().select("_id name email");

    let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại 
    let endOfMonth = new Date(year, month); // cần chỉnh lại

    let tsl = await Task(connect(DB_CONNECTION, portal)).aggregate([
        {
            $match: {
                "timesheetLogs.startedAt": { $exists: true },
                "timesheetLogs.startedAt": { $gte: beginOfMonth },
                "timesheetLogs.stoppedAt": { $exists: true },
                "timesheetLogs.stoppedAt": { $lte: endOfMonth },
            }
        },
        { $unwind: "$timesheetLogs" },
        { $replaceRoot: { newRoot: "$timesheetLogs" } },
        {
            $match: {
                "startedAt": { $exists: true },
                "startedAt": { $gte: beginOfMonth },
                "stoppedAt": { $exists: true },
                "stoppedAt": { $lte: endOfMonth },
                "acceptLog": true
            }
        },
        {
            $group: {
                _id: "$creator",
                total: { $sum: "$duration" }
            }
        },
    ]);

    let allTS = [];
    for (let i = 0; i < tsl.length; i++) {
        let user = users.find(user => {
            if (user && tsl[i] && user._id && tsl[i]._id && user._id.toString() === tsl[i]._id.toString()) return true;
            return false;
        });
        if (user) {
            allTS.push({
                creator: user,
                duration: tsl[i].total
            })
        }
    }

    return allTS;
}

exports.getTasksByProject = async (portal, projectId, page, perPage) => {
    let tasks;
    let totalList = await Task(connect(DB_CONNECTION, portal)).countDocuments({ taskProject: projectId });
    if (page && perPage) {
        tasks = await Task(connect(DB_CONNECTION, portal))
            .find({ taskProject: projectId }).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage))
            .populate({ path: "responsibleEmployees", select: "_id name" })
            .populate({ path: "accountableEmployees", select: "_id name" })
            .populate({ path: "consultedEmployees", select: "_id name" })
            .populate({ path: "informedEmployees", select: "_id name" })
            .populate({ path: "creator", select: "_id name" })
            .populate({ path: "preceedingTasks", select: "_id name" })
            .populate({ path: "overallEvaluation.responsibleEmployees.employee", select: "_id name" })
            .populate({ path: "overallEvaluation.accountableEmployees.employee", select: "_id name" });
        return {
            docs: tasks,
            totalDocs: totalList,
        }
    }
    tasks = await Task(connect(DB_CONNECTION, portal))
        .find({ taskProject: projectId })
        .populate({ path: "responsibleEmployees", select: "_id name" })
        .populate({ path: "accountableEmployees", select: "_id name" })
        .populate({ path: "consultedEmployees", select: "_id name" })
        .populate({ path: "informedEmployees", select: "_id name" })
        .populate({ path: "creator", select: "_id name" })
        .populate({ path: "preceedingTasks", select: "_id name" })
        .populate({ path: "overallEvaluation.responsibleEmployees.employee", select: "_id name" })
        .populate({ path: "overallEvaluation.accountableEmployees.employee", select: "_id name" });
    return tasks;
}

exports.importTasks = async (data, portal, user) => {
    let dataLength = data.length;
    if(data.length){
        for(let x = 0; x < dataLength; x ++){
            let level = 1, parent = null;
            if (data[x].parent) {
                const taskParent = await Task(connect(DB_CONNECTION, portal)).findOne({name: data[x].parent}).select("_id level name parent");
                if (taskParent) {
                    level = taskParent.level + 1;
                    parent = taskParent._id;
                }
            }

            let startDate, endDate;
            if (Date.parse(data[x].startDate)) startDate = new Date(data[x].startDate);
            else {
                const splitter = data[x].startDate.split("-");
                startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
            }

            if (Date.parse(data[x].endDate)) endDate = new Date(data[x].endDate);
            else {
                const splitter = data[x].endDate.split("-");
                endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
            }

            let collaboratedWithOrganizationalUnits = [];
            if (data[x].collaboratedWithOrganizationalUnits?.length) {
                data[x].collaboratedWithOrganizationalUnits.forEach(y => {
                    collaboratedWithOrganizationalUnits = [...collaboratedWithOrganizationalUnits, {
                        organizationalUnit: y,
                    }]
                })
            }

            await Task(connect(DB_CONNECTION, portal)).create({
                ...data[x],
                creator: user._id,
                level: level,
                parent: parent,
                startDate: startDate,
                endDate: endDate,
                formula: "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100",
                taskInformations: [],
                collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
            });
        }
    }
    console.log('done_import_task')
}

// kiểm tra giá trị có nằm trong mảng hay ko. dùng tìm kiếm nhị phân : Độ phức tạp thời gian: O (logN)
_checkItemInArray = (arr, x, getLevel = false) => {
    let _id, level;
    if (arr?.length) {
        const arrLength = arr.length;
        for (let i = 0; i < arrLength; i++){
            if (arr[i]?.name?.toString().trim() === x?.toString()?.trim()) {
                _id = arr[i]._id;
                level = arr[i].level + 1;
                break;
            }
        }
    }
    if (getLevel)
        return { _id, level }
    else
        return _id;
}


exports.importUpdateTasks = async (data, portal, user) => {
    let rowError = [], valueImport = [];
    if (data) {
        const allTask = await Task(connect(DB_CONNECTION, portal)).find({}, {
            _id: 1,
            name: 1,
            level: 1,
        })

        // validate

        if (allTask) {
            data.forEach((x, index) => {
                let item = { ...x };
                if(!x.name){
                    item = {
                            ...item,
                            errorAlert: ["name_task_not_empty"],
                            error: true
                        }
                    rowError = [...rowError, index + 1];
                } else {
                    if (!_checkItemInArray(allTask, x.name)) {
                        item = {
                                ...item,
                                errorAlert: ["name_task_not_found"],
                                error: true
                            }
                        rowError = [...rowError, index + 1];
                    } else {
                        item={
                            ...item,
                            taskNameId: _checkItemInArray(allTask, x.name),
                            name: null, 
                        }
                    }
                }

                

                if (x.parent) {
                    let checkParent = _checkItemInArray(allTask, x.parent, true);
                    if ( !checkParent?._id) {
                        item = {
                                ...item,
                                errorAlert: ["parent_task_not_found"],
                                error: true
                            }
                        rowError = [...rowError, index + 1];
                    }
                    else {
                        item={
                            ...item,
                            parent: checkParent?._id,
                            level: checkParent?.level
                        }
                    }
                }
                
                valueImport = [...valueImport, item];
            })
        }

        console.log('rowError', rowError);
        // console.log('valueImport', valueImport);

        if (rowError.length !== 0) {
            return {
                data: valueImport,
                rowError
            }
        } else {
            const importLength = valueImport.length;
            for (let k = 0; k < importLength; k++) {
                let dataUpdate = {};

                for (let propName in valueImport[k]) {
                    if (valueImport[k][propName] === null ||
                        valueImport[k][propName] === undefined ||
                        valueImport[k][propName] === "" ||
                        (Array.isArray(valueImport[k][propName]) && valueImport[k][propName]?.length === 0)
                        ) {
                        delete valueImport[k][propName];
                    }
                }
                dataUpdate = { ...valueImport[k] };
                if (dataUpdate?.collaboratedWithOrganizationalUnits?.length) {
                    let collaboratedWithOrganizationalUnits = [];
                    if (dataUpdate?.collaboratedWithOrganizationalUnits?.length) {
                        dataUpdate.collaboratedWithOrganizationalUnits.forEach(y => {
                            collaboratedWithOrganizationalUnits = [...collaboratedWithOrganizationalUnits, {
                                organizationalUnit: y,
                            }]
                        })
                    }
                    dataUpdate ={...dataUpdate, collaboratedWithOrganizationalUnits}
                }

                dataUpdate = {...dataUpdate, createdAt: new Date(dataUpdate.createdAt)}

                await Task(connect(DB_CONNECTION, portal)).bulkWrite([
                    {
                        updateOne: {
                            filter: { _id: valueImport[k].taskNameId },
                            update: dataUpdate,
                            timestamps: false, //  set bằng false mới update được 2 trường updatedAt và createdAt
                        }
                    },
                ])
            }
            console.log("DONE UPDATE TASK")
        }
    }
}


exports.importTaskActions = async (data, portal, user) => {
    if (data) {
        let groupByTask = [];
        data.forEach((x,index)=>{
            if (!groupByTask[x.taskName]) {
                groupByTask[x.taskName] = [x]
            } else {
                groupByTask[x.taskName] = [...groupByTask[x.taskName], x]
            }
        })

        // console.log('groupByTask', groupByTask);

        for (let k in groupByTask) {
            let task;
            if (k)
                task = await Task(connect(DB_CONNECTION, portal)).findOne({ name: k }).select("_id taskActions");
            
            if (task) {
                task.taskActions = task.taskActions.concat(groupByTask[k]);
                task.save();
            }
        }
    }
    console.log("DONE_IMPORT_TASK_ACTION!!!")

}


exports.importTimeSheetLogs = async (data, portal, user) => {
    if (data) {
        let groupByTask = [];
        data.forEach((x,index)=>{
            if (!groupByTask[x.taskName]) {
                groupByTask[x.taskName] = [x]
            } else {
                groupByTask[x.taskName] = [...groupByTask[x.taskName], x]
            }
        })

        // console.log('groupByTask', groupByTask)
        
        for (let k in groupByTask) {
            if (k) {
                let infoTimesheetLog = [];
                groupByTask[k].forEach(x => {
                    const duration = new Date(x.addlogStoppedAt).getTime() - new Date(x.addlogStartedAt).getTime();
                    // vì add log trong 1 ngày nên giờ ko quá 24 nên ko cần check acceptLog. default true
                    infoTimesheetLog = [...infoTimesheetLog, {
                        creator: x?.employee,
                        startedAt: new Date(x?.addlogStartedAt),
                        stoppedAt: new Date(x?.addlogStoppedAt),
                        description: x?.description,
                        duration,
                        autoStopped: x?.autoStopped,
                    }]
                })

                await Task(connect(DB_CONNECTION, portal)).bulkWrite([
                    {
                        updateOne: {
                            filter: { name: k?.trim() },
                            update: {
                                timesheetLogs: infoTimesheetLog
                            },
                            upsert: false
                        }
                    },
               ])
                
            }
            console.log('DONE IMPORT TIMESHEET')
        }


        // for (let k in groupByTask) {
        //     let task;
        //     if (k)
        //         task = await Task(connect(DB_CONNECTION, portal)).findOne({ name: k }).select("_id taskActions");
            
        //     if (task) {
        //         task.taskActions = task.taskActions.concat(groupByTask[k]);
        //         task.save();
        //     }
        // }
    }
    console.log("DONE_IMPORT_TIME_SHEET!!!")

}


exports.getOrganizationTaskDashboardChartData = async (data, portal, user) => {
    // return organizationUnitTasks

    let { organizationalUnitId, startMonth, endMonth } = data;
    let organizationUnitTasks;
    let keySearch = {};

    if (organizationalUnitId) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }

    let startDate = new Date(startMonth);
    let endDate = new Date(endMonth);
    endDate.setMonth(endDate.getMonth() + 1);

    if (startDate && endDate) {
        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': -1 })
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })

    // return usersInUnitsOfCompany - Lấy tất nhan vien trong moi đơn vị trong công ty
    const allUnits = await OrganizationalUnit(
        connect(DB_CONNECTION, portal)
    ).find(); // { company: id }
    const newData = allUnits.map((department) => {
        return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            managers: department.managers.map((item) => item.toString()),
            deputyManagers: department.deputyManagers.map((item) => item.toString()),
            employees: department.employees.map((item) => item.toString()),
            parent_id:
                department.parent !== null && department.parent !== undefined
                    ? department.parent.toString()
                    : null,
        };
    });

    let userArray = await _getAllUsersInOrganizationalUnits(portal, newData);

    return [
        {
            name: "general-task-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,
                usersInUnitsOfCompany: userArray
            }
        },
        {
            name: "gantt-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,
            }
        },
        {
            name: "employee-distribution-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,
            }
        },
        {
            name: "in-process-unit-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,
            }
        },
        {
            name: "task-results-domain-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,

            }

        },
        {
            name: "task-status-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,

            }
        },
        {
            name: "average-results-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,

            }
        },
        {
            name: "load-task-organization-chart",
            data: {
                organizationUnitTasks: organizationUnitTasks,

            }
        },
        {
            name: "all-time-sheet-log-by-unit",
            data: {
                organizationUnitTasks: organizationUnitTasks,
            }
        },
    ]

}

_getAllUsersInOrganizationalUnits = async (portal, data) => {
    var userArray = [];
    for (let i = 0; i < data.length; i++) {
        var department = data[i];
        if (department) {
            var userRoles = await UserRole(connect(DB_CONNECTION, portal))
                .find({
                    roleId: {
                        $in: [
                            ...department.managers,
                            ...department.deputyManagers,
                            ...department.employees,
                        ],
                    },
                })
                .populate({
                    path: "userId",
                    select: "name",
                });

            var tmp = await Role(connect(DB_CONNECTION, portal)).find(
                {
                    _id: {
                        $in: [
                            ...department.managers,
                            ...department.deputyManagers,
                            ...department.employees,
                        ],
                    },
                },
                {
                    name: 1,
                }
            );
            var users = {
                managers: {},
                deputyManagers: {},
                employees: {},
                department: department.name,
                id: department.id,
            };
            tmp.forEach((item) => {
                let obj = {};
                obj._id = item.id;
                obj.name = item.name;
                obj.members = [];

                if (department.managers.includes(item._id.toString())) {
                    users.managers[item._id.toString()] = obj;
                } else if (department.deputyManagers.includes(item._id.toString())) {
                    users.deputyManagers[item._id.toString()] = obj;
                } else if (department.employees.includes(item._id.toString())) {
                    users.employees[item._id.toString()] = obj;
                }
            });

            userRoles.forEach((item) => {
                if (users.managers[item.roleId.toString()] && item.userId) {
                    users.managers[item.roleId.toString()].members.push(item.userId);
                } else if (users.deputyManagers[item.roleId.toString()] && item.userId) {
                    users.deputyManagers[item.roleId.toString()].members.push(
                        item.userId
                    );
                } else if (users.employees[item.roleId.toString()] && item.userId) {
                    users.employees[item.roleId.toString()].members.push(
                        item.userId
                    );
                }
            });

            userArray.push(users);
        }
    }
    return userArray;
};