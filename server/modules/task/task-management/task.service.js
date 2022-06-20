const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { Task, TaskTemplate, OrganizationalUnit, User, Company, UserRole, Role } = require('../../../models');
const OrganizationalUnitService = require(`../../super-admin/organizational-unit/organizationalUnit.service`);
const overviewService = require(`../../kpi/employee/management/management.service`);
const UserService = require(`../../super-admin/user/user.service`)
const { sendEmail } = require(`../../../helpers/emailHelper`);
const { connect } = require(`../../../helpers/dbHelper`);
const cloneDeep = require('lodash/cloneDeep');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)



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
    // Lấy danh sachs điều kiện lọc của trường thông tin của công việc, vì dữ liệu gửi trong query là dạng string nên phải parse sang đối tượng
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
        accountableEmployees, creatorEmployees, creatorTime, projectSearch, tags, getAll } = task;
        let taskList, page;
        if (perPage) {
            perPage = Number(perPage);
        } else {
            perPage = 5;
        }
        if (number) {
            page = Number(number);
        } else {
            page = 0;
        }

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

    if (getAll === 'true') {
        taskList = await Task(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ 'createdAt': -1 });
    } else {
        taskList = await Task(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ 'createdAt': -1 })
            .skip(perPage * (page - 1)).limit(perPage).populate([
                { path: "organizationalUnit parent" },
                { path: 'creator', select: "_id name email avatar" },
                { path: 'responsibleEmployees', select: "_id name email avatar" },
                { path: 'accountableEmployees', select: "_id name email avatar" },
                { path: 'consultedEmployees', select: "_id name email avatar" },
                { path: 'informedEmployees', select: "_id name email avatar" },
                { path: "timesheetLogs.creator", select: "name" },
            ]);
        }

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
    let html = `<html>
          <head>
              <style>
                  .wrapper {
                      width: 100%;
                      min-width: 580px;
                      background-color: #FAFAFA;
                      padding: 10px 0;
                  }
                  .userName {
                    font-weight: 700;
                    color: #385898;
                    cursor: pointer;
                  }
          
                  .info {
                      list-style-type: none;
                  }
          
                  @media screen and (max-width: 900px) {
                      .form {
                          border: solid 1px #dddddd;
                          padding: 50px 30px;
                          border-radius: 3px;
                          margin: 0px 5%;
                          background-color: #FFFFFF;
                      }
                  }
          
                  .form {
                      border: solid 1px #dddddd;
                      padding: 50px 30px;
                      border-radius: 3px;
                      margin: 0px 25%;
                      background-color: #FFFFFF;
                  }
          
                  .title {
                      text-align: center;
                  }
          
                  .footer {
                      margin: 0px 25%;
                      text-align: center;
          
                  }
              </style>
          </head>
          
          <body>
              <div class="wrapper">
                  <div class="title">
                      <h1>${process.env.WEB_NAME}</h1>
                  </div>
                  <div class="form">
                    <p>Bạn có công việc mới:  ${body};
                  </div>
                  <div class="footer">
                      <p>Copyright by
                          <i>Công ty Cổ phần Công nghệ
                              <br />
                              An toàn thông tin và Truyền thông Việt Nam</i>
                      </p>
                  </div>
              </div>
          </body>
        </html>`;
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
        taskProject: taskProject,
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
        // parent : parent: (task.parent === "") ? null : task.parent,
        level: 1,
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
exports.deleteTask = async (portal, taskId, userId) => {
    //req.params.taskId
    let allowDelete = false;
    let deleteSuccess = 0;
    taskId = taskId.split(",");
    userId = userId.toString();
    for (let i in taskId) {
        let tasks = await Task(connect(DB_CONNECTION, portal)).findById(taskId[i]);

        //kiểm tra quyền được xoá của người dùng
        if (tasks.creator && tasks.creator.toString() === userId || tasks.informedEmployees.map(o => o.toString()).indexOf(userId) !== -1) {
            if (tasks.creator.toString() === userId) allowDelete = true;
        }
        if (tasks.responsibleEmployees && tasks.responsibleEmployees.map(o => o.toString()).indexOf(userId) !== -1 || tasks.consultedEmployees && tasks.consultedEmployees.map(o => o.toString()).indexOf(userId) !== -1) {
            allowDelete = false;
        }
        if (tasks.accountableEmployees && tasks.accountableEmployees.map(o => o.toString()).filter(str => str === userId).length > 0) {
            allowDelete = true;
        }

        if (allowDelete) {
            if (tasks.taskTemplate !== null) {
                await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
                    tasks.taskTemplate, { $inc: { 'numberOfUse': -1 } }, { new: true }
                );
            }

            await Task(connect(DB_CONNECTION, portal)).findByIdAndDelete(taskId[i]); // xóa mẫu công việc theo id
            deleteSuccess = deleteSuccess + 1;
        }

    }
    if (deleteSuccess === 0) throw ['delete_fail'];
    else return taskId;
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
exports.getTaskAnalyseOfUser = async (portal, userId, type, date) => {
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
 * Lấy lịch sử bấm giờ làm việc của người dùng theo từng tháng trong năm
 * @param {*} portal
 * @param {*} userId-(optional)
 * @param {*} month
 * @param {*} year
 * @param {*} requireActions
 */
exports.getUserTimeSheet = async (portal, userId, month, year, requireActions) => {
    let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại
    let endOfMonth = new Date(year, month); // cần chỉnh lại
    
    // Nếu cần lấy chi tiết từng hoạt động trong công việc
    if (requireActions == 'true') {
        let tsl = await Task(connect(DB_CONNECTION, portal)).aggregate([
            {
                $match: {
                    "taskActions.timesheetLogs.creator": mongoose.Types.ObjectId(userId),
                    "taskActions.timesheetLogs.startedAt": {$exists: true},
                    "taskActions.timesheetLogs.startedAt": {$gte: beginOfMonth},
                    "taskActions.timesheetLogs.startedAt": {$lte: endOfMonth},
                    "taskActions.timesheetLogs.stoppedAt": {$exists: true},
                }
            },
            {
                $project: {
                    "name": 1,
                    "taskActions.description": 1,
                    "taskActions.timesheetLogs": 1
                }
            }
        ]);
        return tsl;
    }
    // Nếu trong query có userId thì trả về timesheetLogs của user với ID đó
    if (userId) {
        let tsl = await Task(connect(DB_CONNECTION, portal)).aggregate([
            {
                $match: {
                    "taskActions.timesheetLogs.creator": mongoose.Types.ObjectId(userId),
                    "taskActions.timesheetLogs.startedAt": {$exists: true},
                    "taskActions.timesheetLogs.startedAt": {$gte: beginOfMonth},
                    "taskActions.timesheetLogs.startedAt": {$lte: endOfMonth},
                    "taskActions.timesheetLogs.stoppedAt": {$exists: true},
                }
            },
            {$unwind: "$taskActions"},
            {$replaceRoot: {
                newRoot: { 
                    $mergeObjects: 
                    [
                        { _id: "$_id", name: "$name", actionDescription: "$taskActions.description", actionId: "$taskActions._id"},
                        "$taskActions"
                    ]
                }
            }},
            {$unwind: "$timesheetLogs"},
            {$replaceRoot: {
                newRoot: { 
                    $mergeObjects: 
                    [
                        { _id: "$_id", name: "$name", actionDescription: "$actionDescription", actionId: "$actionId"},
                        "$timesheetLogs"
                    ]
                }
            }},
            {
                $match: {
                    "creator": mongoose.Types.ObjectId(userId),
                    "startedAt": {$exists: true},
                    "startedAt": {$gte: beginOfMonth},
                    "startedAt": {$lte: endOfMonth},
                    "stoppedAt": {$exists: true},
                },
            },
        ]);
        return tsl;
    }
}

/**
 *
 * Lấy thông tin bấm giờ, tổng số công việc của tất cả nhân viên trong tháng
 * @param {*} portal
 * @param {*} month
 * @param {*} year
 * @param {*} rowLimit
 * @param {*} page
 * @param {*} timeLimit
 * @param {*} unitArray
 */
exports.getAllUserTimeSheetLog = async (portal, month, year, rowLimit, page, timeLimit, unitArray, sortType) => {
    let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại
    let endOfMonth = new Date(year, month); // cần chỉnh lại

    let listEmployee = await UserService.getAllEmployeeOfUnitByIds(portal, {ids: unitArray});
    let listTask = await Task(connect(DB_CONNECTION, portal)).aggregate([
        {
            $match: {
                "startDate": {$exists: true},
                "startDate": {$lte: endOfMonth},
                "endDate": {$exists: true},
                "endDate": {$gte: beginOfMonth}
            },
        },
        {
            $project: {
                "name": 1,
                "responsibleEmployees": 1,
                "accountableEmployees": 1,
                "consultedEmployees": 1,
                "informedEmployees": 1,
                "timesheetLogs": 1,
                "organizationalUnit": 1
            }
        }
    ]);

    

    let countResponsibleTasks = [],
        countAccountableTasks = [],
        countConsultedTasks = [],
        countInformedTasks = [],
        totalTasks = [],
        exist = [],
        totalDuration = [[],[],[],[]],
        unitDuration = new Map();

    for (let employee of listEmployee.employees) {
        countResponsibleTasks[employee.userId._id.toString()] = 0;
        countAccountableTasks[employee.userId._id.toString()] = 0;
        countConsultedTasks[employee.userId._id.toString()] = 0;
        countInformedTasks[employee.userId._id.toString()] = 0;
        totalTasks[employee.userId._id.toString()] = 0;
        totalDuration[1][employee.userId._id.toString()] = 0;
        totalDuration[2][employee.userId._id.toString()] = 0;
        totalDuration[3][employee.userId._id.toString()] = 0;
        unitDuration.set(employee.userId._id.toString(), new Map());
    }

    for (let task of listTask) {
        exist = [];
        for (let a of task.responsibleEmployees) {
            if (  !countResponsibleTasks.includes(a.toString()) ) continue;
            countResponsibleTasks[a.toString()] += 1;
            if (!exist[a.toString()]) {
                totalTasks[a.toString()]+= 1;
            }
            exist[a.toString()] = true;
        }

        for (let a of task.accountableEmployees) {
            if (  !countAccountableTasks.includes(a.toString())  ) continue;
            countAccountableTasks[a.toString()]+= 1;
            if (!exist[a.toString()]) {
                totalTasks[a.toString()]+= 1
            }
            exist[a.toString()] = true;
        }

        for (let a of task.consultedEmployees) {
            if (  !countConsultedTasks.includes(a.toString())   ) continue;
            countConsultedTasks[a.toString()] += 1;
            if (!exist[a.toString()]) {
                totalTasks[a.toString()]+= 1
            }
            exist[a.toString()] = true;
        }
        
        for (let a of task.informedEmployees) {
            if (  !countInformedTasks.includes(a.toString())   ) continue;
            countInformedTasks[a.toString()]+= 1;
            if (!exist[a.toString()]) {
                totalTasks[a.toString()]+= 1
            }
            exist[a.toString()] = true;
        }

        for (let a of task.timesheetLogs) {
            if (a.acceptLog == true && beginOfMonth <= a.stoppedAt && a.stoppedAt <= endOfMonth ) {
                if (  !unitDuration.has(a.creator.toString())  ) continue;
                totalDuration[a.autoStopped][a.creator.toString()] += a.duration;
                if (  unitDuration.get(a.creator.toString()).has(task.organizationalUnit)  ) {
                    unitDuration.get(a.creator.toString())[task.organizationalUnit] += a.duration;
                } else {
                    unitDuration.get(a.creator.toString()).set(task.organizationalUnit, a.duration);
                }
            }
        }
    }

    listEmployee.docs = listEmployee.employees.map(obj => ({
        active: obj.userId.active,
        _id: obj.userId._id,
        name: obj.userId.name,
        countResponsibleTasks: 0,
        countAccountableTasks: 0,
        countConsultedTasks: 0,
        countInformedTasks: 0,
        totalTasks: 0,
        totalDuration: [0, 0, 0, 0], // 1: Bấm giờ, 2: Bấm hẹn giờ, 3: Bấm bù giờ
        unitDuration: []
    }))

    delete listEmployee.employees;

    for (let employee of listEmployee.docs) {
        employee.countResponsibleTasks = countResponsibleTasks[employee._id.toString()];
        employee.countAccountableTasks = countAccountableTasks[employee._id.toString()];
        employee.countConsultedTasks = countConsultedTasks[employee._id.toString()];
        employee.countInformedTasks = countInformedTasks[employee._id.toString()];
        employee.totalTasks = totalTasks[employee._id.toString()];
        employee.totalDuration[1] = totalDuration[1][employee._id.toString()];
        employee.totalDuration[2] = totalDuration[2][employee._id.toString()];
        employee.totalDuration[3] = totalDuration[3][employee._id.toString()];
        employee.totalDuration[0] = employee.totalDuration[1] + employee.totalDuration[2] + employee.totalDuration[3];
        employee.unitDuration = Array.from(unitDuration.get(employee._id.toString()), 
                                            ([name, value]) => ({name, value}) );
    }

    listEmployee.docs = listEmployee.docs.filter((employee) => {
        return employee.totalDuration[1] + employee.totalDuration[2] + employee.totalDuration[3] >= 60 * 60 * 1000 * timeLimit
            && employee.active == true;
    })

    if (sortType != 0) {
        listEmployee.docs.sort((a, b) => {
            if (sortType == 1) {
                if (a.totalDuration[0] > b.totalDuration[0]) 
                    return 1;
                return -1;
            } else {
                if (b.totalDuration[0] > a.totalDuration[0])
                    return 1;
                return -1;
            }
        })
    }

    listEmployee = {
        ...listEmployee,
        totalDocs: listEmployee.docs.length,
        limit: Number(rowLimit),
        totalPages: Math.ceil(listEmployee.docs.length / rowLimit),
        page: Number(page),
    }

    listEmployee.docs = listEmployee.docs.slice( (page - 1) * rowLimit, page * rowLimit);
    return listEmployee;
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


exports.checkImportTasks = async (data, portal, user) => {
    if (data?.length) {
        let dataLength = data.length;
        let rowError = [], arrTaskCode = [], arrayParentCode = [];

        //Xử lý dữ liệu lấy code và parentCode công việc
        for (let i = 0; i < dataLength; i++) {
            if (data[i]?.code)
                arrTaskCode = [...arrTaskCode, data[i].code];
            if (data[i]?.parent)
                arrayParentCode = [...arrayParentCode, data[i].parent];
        }

        // truy vấn lấy thêm thông tin của task dựa vào code lấy ở file excell
        const taskCodeFilter = await Task(connect(DB_CONNECTION, portal)).find({ code: { $in: arrTaskCode } }).select("name parent level code");
        const parentCodeFilter = await Task(connect(DB_CONNECTION, portal)).find({ code: { $in: arrayParentCode } }).select("name parent level code");

        let dataConvert = []
        data.forEach((element, index) => {
            let errorAlert = [];
            // kiểm tra code công việc trống
            if (!element.code) {
                errorAlert = [...errorAlert, "code_empty"];
            }

            // Kiểm tra code công việc đã tồn tại trên hệ thống
            if (taskCodeFilter?.length && taskCodeFilter.find(x => x.code === element.code)) {
                errorAlert = [...errorAlert, "code_duplicate"];
            }

            // Kiểm tra parentCode 
            const findParentCode = element.parent && parentCodeFilter?.length && parentCodeFilter.find(x => x.code === element.parent);

            let checkParentCodeInFileExcell = false;

            if (element.parent && !findParentCode) { // nếu chưa tồn tại trên hệ thống
                for (let t = 0; t < dataLength; t++) {
                    if (t < index) {
                        if (data[t]?.code?.toString()?.trim() === element?.parent?.toString()?.trim()) {
                            checkParentCodeInFileExcell = true;
                            break;
                        }
                    }
                }

                if (!checkParentCodeInFileExcell) // và chưa tồn tại trong file thì sẽ báo lỗi
                {
                    errorAlert = [...errorAlert, "parent_code_not_found"]; // parent code ko tìm thấy được ở trên file và trên hệ thống.
                }
            }

            element = { ...element, errorAlert }
            if (element.parent && findParentCode) {
                element = { ...element, parentId: findParentCode._id }
            }


            if (!element.code || taskCodeFilter?.length && taskCodeFilter.find(x => x.code === element.code) || (element.parent && !findParentCode && !checkParentCodeInFileExcell)) {
                rowError = [...rowError, index + 1];
                element = { ...element, error: true }
            }
            dataConvert = [...dataConvert, element];
        })

        if (rowError?.length !== 0) {
            return {
                data: dataConvert,
                rowError
            }
        } else {
            return {
                data: dataConvert
            }
        }
    }
}

exports.importTasks = async (dataConvert, portal, user) => {
    if (dataConvert?.length) {
        console.log("PROCESSS", dataConvert?.length)

        let taskNotParentAndHasParentId = [], task = [];
        dataConvert.forEach((x, index) => {
            let startDate, endDate;
            if (Date.parse(x.startDate)) startDate = new Date(x.startDate);
            else {
                if (x.startDate) {
                    const splitter = x.startDate.split("-")
                    startDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                } else {
                    startDate = null
                }
            }

            if (Date.parse(x.endDate)) endDate = new Date(x.endDate);
            else {
                if (x.endDate) {
                    const splitter = x.endDate.split("-");
                    endDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
                } else {
                    endDate = null;
                }
            }

            let collaboratedWithOrganizationalUnits = [];
            if (x.collaboratedWithOrganizationalUnits?.length) {
                x.collaboratedWithOrganizationalUnits.forEach(y => {
                    collaboratedWithOrganizationalUnits = [...collaboratedWithOrganizationalUnits, {
                        organizationalUnit: y,
                    }]
                })
            }

            if (!x.parent || x?.parentId) {
                taskNotParentAndHasParentId = [...taskNotParentAndHasParentId, {
                    ...x,
                    creator: x?.creator ? x.creator : user._id,
                    name: x?.name ? x.name.toString().trim() : "",
                    parent: x?.parent ? x.parentId : null,
                    startDate: startDate,
                    endDate: endDate,
                    formula: "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100",
                    taskInformations: [],
                    collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
                }]
            } else {
                task = [...task, {
                    ...x,
                    creator: x?.creator ? x.creator : user._id,
                    name: x?.name ? x.name.toString().trim() : "",
                    startDate: startDate,
                    endDate: endDate,
                    formula: "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100",
                    taskInformations: [],
                    collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
                }]
            }
        })


        // những công việc ko có trường parent và 1 số trường parent đã tồn tại trên hệ thống rồi thì lưu thẳng
        if (taskNotParentAndHasParentId?.length) {
            await Task(connect(DB_CONNECTION, portal)).insertMany(taskNotParentAndHasParentId);
        }

        // các task còn lại những task có parent, parent có trong file và chưa có trên hệ thống
        if (task?.length) {
            const taskLength = task.length;
            for (let ts = 0; ts < taskLength; ts++) {
                const taskParent = await Task(connect(DB_CONNECTION, portal)).findOne({ code: task[ts].parent }).select("_id name parent");

                await Task(connect(DB_CONNECTION, portal)).create({
                    ...task[ts],
                    parent: taskParent ? taskParent._id : null
                });
            }
        }
    }
    console.log('DONE_IMPORT TASK')
}


// kiểm tra giá trị có nằm trong mảng hay ko.
_checkItemInArray = (arr, x, getLevel = false) => {
    let _id, level;
    if (arr?.length) {
        const arrLength = arr.length;
        for (let i = 0; i < arrLength; i++) {
            if (arr[i]?.code?.toString().trim() === x?.toString()?.trim()) {
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

exports.checkImportUpdateTasks = async (data, portal, user) => {
    let rowError = [], valueImport = [];
    if (data?.length) {
        let dataLength = data.length, arrTaskCode = [];
        for (let i = 0; i < dataLength; i++) {
            if (data[i]?.code)
                arrTaskCode = [...arrTaskCode, data[i].code];
            // if (data[i]?.parent)
            //     arrayParentCode = [...arrayParentCode, data[i].parent];
        }

        const allTask = await Task(connect(DB_CONNECTION, portal)).find({ code: { $in: arrTaskCode } }, {
            _id: 1,
            name: 1,
            code: 1,
        })

        // validate

        if (allTask) {
            data.forEach((x, index) => {
                let item = { ...x };
                if (!x.code) {
                    item = {
                        ...item,
                        errorAlert: ["code_task_not_empty"],
                        error: true
                    }
                    rowError = [...rowError, index + 1];
                } else {
                    if (!_checkItemInArray(allTask, x.code)) {
                        item = {
                            ...item,
                            errorAlert: ["code_task_not_found"],
                            error: true
                        }
                        rowError = [...rowError, index + 1];
                    } else {
                        item = {
                            ...item,
                            taskNameId: _checkItemInArray(allTask, x.code),
                            name: null,
                        }
                    }
                }



                if (x.parent) {
                    let checkParent = _checkItemInArray(allTask, x.parent, true);
                    if (!checkParent?._id) {
                        item = {
                            ...item,
                            errorAlert: ["parent_task_not_found"],
                            error: true
                        }
                        rowError = [...rowError, index + 1];
                    }
                    else {
                        item = {
                            ...item,
                            parent: checkParent?._id,
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
            return {
                data: valueImport,
            }
        }
    }
}

exports.importUpdateTasks = async (valueImport, portal, user) => {
    if (valueImport?.length) {
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
                dataUpdate = { ...dataUpdate, collaboratedWithOrganizationalUnits }
            }

            if (dataUpdate.createdAt) {
                dataUpdate = { ...dataUpdate, createdAt: new Date(dataUpdate.createdAt) }
            }


            // console.log('dataUpdate',dataUpdate)
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


exports.importTaskActions = async (data, portal, user) => {
    if (data) {
        let groupByTask = [];
        // merge các hoạt động công việc lại
        data.forEach((x, index) => {
            if (!groupByTask[x?.code]) {
                groupByTask[x?.code] = [x]
            } else {
                groupByTask[x?.code] = [...groupByTask[x?.code], x]
            }
        })

        // lấy danh sách mảng các code công việc
        let arrayCode = [];
        for (let k in groupByTask) {
            arrayCode = [...arrayCode, k];
        }


        // Lấy thông tin của các task dựa vào code lấy trong sheet thông tin hoạt động.
        let getTaskInfo = [];
        if (arrayCode?.length) {
            getTaskInfo = await Task(connect(DB_CONNECTION, portal)).find({ code: { $in: arrayCode } }).select("code taskActions");
        }

        // start validate
        // Sắp làm
        // endValidate

        let dataImport = [];

        for (let k in groupByTask) {
            let findTask = getTaskInfo?.length && getTaskInfo.find(x => x?.code?.toString() === k.toString())
            let taskActions = [];
            if (k && findTask) {
                taskActions = findTask.taskActions.concat(groupByTask[k]);
                dataImport = [...dataImport, {
                    updateOne: {
                        filter: { _id: findTask._id },
                        update: {
                            taskActions
                        },
                    }
                }]
            }
        }

        await Task(connect(DB_CONNECTION, portal)).bulkWrite(dataImport)
    }
    console.log("DONE_IMPORT_TASK_ACTIONS");
}


exports.importTimeSheetLogs = async (data, portal, user) => {
    if (data) {
        let groupByTask = [];
        data.forEach((x, index) => {
            if (!groupByTask[x?.code]) {
                groupByTask[x?.code] = [x]
            } else {
                groupByTask[x?.code] = [...groupByTask[x?.code], x]
            }
        })

        // lấy danh sách mảng các code công việc
        let arrayCode = [];
        for (let k in groupByTask) {
            arrayCode = [...arrayCode, k];
        }


        // Lấy thông tin của các task dựa vào code lấy trong sheet thông tin hoạt động.
        let getTaskInfo = [];
        if (arrayCode?.length) {
            getTaskInfo = await Task(connect(DB_CONNECTION, portal)).find({ code: { $in: arrayCode } }).select("code timesheetLogs");
        }


        let dataImport = [];

        for (let k in groupByTask) {
            if (k) {
                let findTask = getTaskInfo?.length && getTaskInfo.find(x => x?.code?.toString() === k.toString())
                if (findTask) {

                    // xử lý data lưu vào timeSheetLogs
                    let infoTimesheetLog = [];
                    if (findTask?.timesheetLogs?.length) {
                        infoTimesheetLog = [...findTask.timesheetLogs];
                    }

                    let totalDurationNew = findTask?.hoursSpentOnTask?.totalHoursSpent ? findTask?.hoursSpentOnTask?.totalHoursSpent : 0;
                    let contributionsnew = [];

                    groupByTask[k].forEach(x => {
                        const duration = new Date(x.addlogStoppedAt).getTime() - new Date(x.addlogStartedAt).getTime();
                        totalDurationNew = totalDurationNew + duration;

                        // vì add log trong 1 ngày nên giờ ko quá 24 nên ko cần check acceptLog. default true
                        infoTimesheetLog = [...infoTimesheetLog, {
                            creator: x?.employee,
                            startedAt: new Date(x?.addlogStartedAt),
                            stoppedAt: new Date(x?.addlogStoppedAt),
                            description: x?.description,
                            duration,
                            autoStopped: x?.autoStopped,
                        }]

                        contributionsnew = [...contributionsnew, {
                            employee: x?.employee,
                            hoursSpent: duration
                        }]
                    })


                    let result = [];
                    // gom và tính totongr của những người bị có nhiều thời gian bấm giờ
                    contributionsnew.reduce(function (res, value) {
                        if (!res[value.employee]) {
                            res[value.employee] = { employee: value.employee, hoursSpent: 0 };
                            result.push(res[value.employee])
                        }
                        res[value.employee].hoursSpent += value.hoursSpent;
                        return res;
                    }, {});

                    let ctr = [];
                    if (findTask?.hoursSpentOnTask?.contributions) {
                        ctr = [...ctr, ...findTask?.hoursSpentOnTask?.contributions];
                    }
                    if (result) {
                        ctr = [...ctr, ...result];
                    }

                    // Xử lý dữ liệu đưa vào hoursSpentOnTask
                    dataImport = [...dataImport, {
                        updateOne: {
                            filter: { _id: findTask._id },
                            update: {
                                timesheetLogs: infoTimesheetLog,
                                hoursSpentOnTask: {
                                    totalHoursSpent: totalDurationNew,
                                    contributions: ctr
                                }
                            }
                        }
                    }]
                }
            }
        }

        await Task(connect(DB_CONNECTION, portal)).bulkWrite(dataImport);
    }
    console.log("DONE_IMPORT_TIME_SHEET!!!")

}
/**
 * Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị
 * @param {*} query 
 * @param {*} portal 
 * @param {*} user 
 * @returns 
 */
exports.getOrganizationTaskDashboardChartData = async (query, portal, user) => {

    Object.keys(query).forEach((key) => {
        query[key] = JSON.parse(query[key])
    });
    
    const data = query["query"] ? query["query"] : query ;
    console.log("data", data);
    const chartArr = Object.keys(data);
    let result = {};
    const { organizationalUnitId, startMonth, endMonth } = data["common-params"]

    // const { organizationalUnitId, startMonth, endMonth, type } = data;
    const userId = user._id

    // const dataSearch = JSON.parse(data.dataSearch)

    let userArray;
    let resultDomain, resultGeneral, resultGantt, resultDistribution,
        resultInprocess, resultStatus, resultAverage, resultLoad, resultAllTimeSheetLog;

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

    const organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': -1 })
        .populate({ path: "organizationalUnit parent" })
        .populate({ path: "creator", select: "_id name email avatar" })
        .populate({ path: "responsibleEmployees", select: "_id name email avatar" })

    const allUnits = await OrganizationalUnit(
        connect(DB_CONNECTION, portal)
    ).find(); // { company: id }
    const unitsNameId = allUnits.map(a => ({ id: a._id, name: a.name }))
    const newDataUnit = allUnits.map((department) => {
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

    //data cho tổng quan công việc
    if (chartArr.includes('general-task-chart')) {
        userArray = await UserService._getAllUsersInOrganizationalUnits(portal, newDataUnit);
        const listEmployee = {}, dataTable = [];
        //Lay cac cong viec cua cac unit da chon
        const tasksOfSelectedUnit = organizationUnitTasks?.filter(x =>
            organizationalUnitId?.includes(x?.organizationalUnit?._id.toString()))
        // Dem cong viec cua tat ca cac unit da chon
        let dataRow = _countTask(tasksOfSelectedUnit, 'Tổng');
        dataTable.push(dataRow);
        // Dem cong viec cua tung unit da chon
        let listUnit = [];
        unitsNameId && unitsNameId.forEach(unit => {
            if (organizationalUnitId?.includes(unit?.id.toString())) {
                listUnit.push(unit);
            }
        });
        const employeesNew = _freshListEmployee(userArray);
        if (employeesNew && employeesNew.length) {
            for (let i in employeesNew) {
                let x = employeesNew[i]
                listEmployee[x._id] = x.name;
            }
        }
        let data1 = {};
        for (let i in tasksOfSelectedUnit) {
            let result = _processTask(tasksOfSelectedUnit[i])
            let unitName = tasksOfSelectedUnit?.[i]?.organizationalUnit?.name;

            for (let j in result) {
                if (data1 && !data1?.[unitName]) {
                    data1[unitName] = {};
                }
                if (data1?.[unitName] && !data1?.[unitName]?.[result?.[j]]) {
                    data1[unitName][result[j]] = [];
                }

                if (data1[unitName]) {
                    data1[unitName][result[j]] = [...data1[unitName][result[j]], tasksOfSelectedUnit[i]];
                    data1[unitName].name = unitName;
                }

                let resEmployee = tasksOfSelectedUnit[i].responsibleEmployees;
                let employeeInTask = [];

                for (let e in resEmployee) {
                    employeeInTask.push(resEmployee[e].id)
                }
                // Loc cac id trung nhau
                let uniqueEmployeeId = Array.from(new Set(employeeInTask));

                for (let k in uniqueEmployeeId) {
                    let idEmployee = uniqueEmployeeId[k];
                    if (data1?.[unitName] && !data1[unitName][idEmployee]) {
                        data1[unitName][idEmployee] = {}
                    }
                    if (data1?.[unitName]?.[idEmployee] && !data1[unitName][idEmployee][result?.[j]]) {
                        data1[unitName][idEmployee][result[j]] = [];
                    }
                    if (data1?.[unitName]?.[idEmployee]) {
                        data1[unitName][idEmployee][result[j]] = [...data1[unitName][idEmployee][result[j]], tasksOfSelectedUnit[i]];
                        data1[unitName][idEmployee].name = idEmployee;
                    }
                }
            }
        }


        for (let i in listUnit) {
            let unitName = listUnit?.[i]?.name;
            if (!Object.keys(data1).includes(unitName)) {
                dataTable.push({
                    parent: true,
                    _id: unitName,
                    confirmedTask: [],
                    delayTask: [],
                    intimeTask: [],
                    name: unitName,
                    noneUpdateTask: [],
                    overdueTask: [],
                    totalTask: [],
                    taskFinished: [],
                    taskInprocess: [],
                    organization: true,
                    show: true,
                });
            }
            else {
                let unit = data1[unitName];
                // chỉ lấy các thuộc tính id, name, startDate, endDate, status, progress
                const confirmedTask = unit.confirmedTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const delayTask = unit.delayTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const intimeTask = unit.intimeTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const noneUpdateTask = unit.noneUpdateTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const overdueTask = unit.overdueTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const totalTask = unit.totalTask?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const taskFinished = unit.taskFinished?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                const taskInprocess = unit.taskInprocess?.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress }))
                // Thêm số công việc của cả phòng vào mảng dataTable
                dataTable.push({
                    parent: true,
                    _id: unitName,
                    confirmedTask: confirmedTask ? confirmedTask : [],
                    delayTask: delayTask ? delayTask : [],
                    intimeTask: intimeTask ? intimeTask : [],
                    name: unitName,
                    noneUpdateTask: noneUpdateTask ? noneUpdateTask : [],
                    overdueTask: overdueTask ? overdueTask : [],
                    totalTask: totalTask ? totalTask : [],
                    taskFinished: taskFinished ? taskFinished : [],
                    taskInprocess: taskInprocess ? taskInprocess : [],
                    organization: true,
                    show: true,
                });
                // Thêm số công việc tuwngf nhaan vieen trong phòng vào mảng dataTable
                for (let key in unit) {
                    if (unit[key].name) {
                        dataTable.push({
                            _id: unit?.[key]?.name,
                            parent: unitName,
                            confirmedTask: unit?.[key]?.confirmedTask ? unit[key].confirmedTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            delayTask: unit?.[key]?.delayTask ? unit[key].delayTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            intimeTask: unit?.[key]?.intimeTask ? unit[key].intimeTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            name: listEmployee?.[unit?.[key].name],
                            noneUpdateTask: unit?.[key]?.noneUpdateTask ? unit[key].noneUpdateTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            overdueTask: unit?.[key]?.overdueTask ? unit[key].overdueTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            totalTask: unit?.[key]?.totalTask ? unit[key].totalTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            taskFinished: unit?.[key]?.taskFinished ? unit[key].taskFinished.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            taskInprocess: unit?.[key]?.taskInprocess ? unit[key].taskInprocess.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })) : [],
                            organization: false,
                            show: false,
                        });
                    }
                }
            }
        }

        resultGeneral = {
            dataChart: dataTable
        }
        result['general-task-chart'] = resultGeneral
    }

    //data cho gantt chart
    if (chartArr.includes('gantt-chart')) {
        let listTask = cloneDeep(organizationUnitTasks)
        const tasksOfSelectedUnit = listTask?.filter(x =>
            organizationalUnitId?.includes(x?.organizationalUnit?._id.toString()))

        let line = 0;
        let data1 = [];
        let count = { delay: 0, intime: 0, notAchived: 0 };
        let taskFilter = [];
        let status = data["gantt-chart"].status;

        // Lọc công việc theo trạng thái
        for (let i in status) {
            for (let j in tasksOfSelectedUnit) {
                if (tasksOfSelectedUnit[j].status === status[i]) {
                    taskFilter.push(tasksOfSelectedUnit[j])
                }
            }
        }

        // sắp xếp các công việc theo tên ngươi thực hiện
        let sortTaskObj = {};
        for (let i in taskFilter) {
            let item = taskFilter[i];
            if (item.responsibleEmployees) {
                //cong viec 1 nguoi thuc hien
                if (item.responsibleEmployees.length == 1) {
                    let employee = item.responsibleEmployees[0].name;
                    if (!sortTaskObj[employee]) sortTaskObj[employee] = [];
                    sortTaskObj[employee].push(item)
                }
                // cong viec nhieu nguoi thuc hien
                else {
                    if (!sortTaskObj.multipleEmployee) sortTaskObj.multipleEmployee = [];
                    sortTaskObj.multipleEmployee.push(item)
                }
            }
        }

        let dataEmployee;
        for (let groupName in sortTaskObj) {
            let label = groupName;

            if (groupName == "multipleEmployee") {
                label = "Nhiều người thực hiện";
            }
            dataEmployee = _getDataGroupByRole(data1, sortTaskObj[groupName], groupName, label, count, line, status)
            data1 = dataEmployee.data;
            count = dataEmployee.count;
            line = dataEmployee.line;
        }

        let dataAllTask = dataEmployee ? dataEmployee.data : [];
        let countAllTask = dataEmployee ? dataEmployee.count : {};
        let lineAllTask = dataEmployee ? dataEmployee.line : {};

        resultGantt = {
            dataChart: {
                dataAllTask,
                countAllTask,
                lineAllTask
            }
        }
        result["gantt-chart"] = resultGantt
    }

    //data cho đóng góp công việc 
    if (chartArr.includes('employee-distribution-chart')) {
        let dataSearch = data['employee-distribution-chart']
        let dataSearchDistribution = {
            ids: organizationalUnitId,
        }
        const employeeListDistribution = await UserService.getAllEmployeeOfUnitByIds(portal, dataSearchDistribution)

        let status = dataSearch?.status;
        let taskListByStatus;
        let taskListEmployee = [], numOfAccountableTask = [], numOfConsultedTask = [], numOfResponsibleTask = [], numOfInformedTask = [], nameEmployee = [];
        let accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;

        let listEmployee = employeeListDistribution?.employees;
        if (status) {
            taskListByStatus = organizationUnitTasks?.filter((task) => {
                let stt = status;
                for (let i in stt) {
                    if (task.status === stt[i])
                        return true;
                }
            })
        }

        if (listEmployee) {
            for (let i in listEmployee) {
                taskListByStatus && taskListByStatus.map(task => {
                    for (let j in task?.accountableEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id.toString() == task?.accountableEmployees?.[j].toString()) {
                            accountableEmployees += 1;
                        }

                    for (let j in task?.consultedEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id.toString() == task?.consultedEmployees?.[j].toString()) {
                            consultedEmployees += 1;
                        }

                    for (let j in task?.responsibleEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id.toString() == task?.responsibleEmployees?.[j]._id.toString()) {
                            responsibleEmployees += 1;
                        }

                    for (let j in task?.informedEmployees)
                        if (listEmployee?.[i]?.userId?._id && listEmployee?.[i]?.userId?._id.toString() == task?.informedEmployees?.[j].toString()) {
                            informedEmployees += 1;
                        }

                })
                let employee = {
                    infor: listEmployee?.[i],
                    accountableEmployees: accountableEmployees,
                    consultedEmployees: consultedEmployees,
                    responsibleEmployees: responsibleEmployees,
                    informedEmployees: informedEmployees,
                }
                taskListEmployee.push(employee);
                accountableEmployees = 0;
                consultedEmployees = 0;
                responsibleEmployees = 0;
                informedEmployees = 0;
            }
        }
        numOfResponsibleTask.push("numOfResponsibleTask")
        numOfAccountableTask.push("numOfAccountableTask")
        numOfConsultedTask.push("numOfConsultedTask")
        numOfInformedTask.push("numOfInformedTask")
        for (let i in taskListEmployee) {
            numOfAccountableTask.push(taskListEmployee?.[i]?.accountableEmployees)
            numOfConsultedTask.push(taskListEmployee?.[i]?.consultedEmployees)
            numOfResponsibleTask.push(taskListEmployee?.[i]?.responsibleEmployees)
            numOfInformedTask.push(taskListEmployee?.[i]?.informedEmployees)
            nameEmployee.push(taskListEmployee?.[i]?.infor?.userId?.name)
        }

        let dataChart = {
            nameEmployee: nameEmployee,
            taskCount: [numOfResponsibleTask, numOfAccountableTask, numOfConsultedTask, numOfInformedTask],
            totalEmployee: employeeListDistribution?.totalEmployee,
        }
        resultDistribution = {
            dataChart: dataChart,
        }
        result["employee-distribution-chart"] = resultDistribution
    }

    //data cho tiến độ công việc
    if (chartArr.includes('in-process-unit-chart')) {
        let taskList = cloneDeep(organizationUnitTasks);
        let delayed = ['Trễ tiến độ'];
        let intime = ['Đúng tiến độ'];
        let notAchived = ['Quá hạn'];
        if (taskList && taskList.length !== 0) {
            let selectedUnit = organizationalUnitId;
            for (let i in selectedUnit) {
                let delayedCnt = 0, intimeCnt = 0, notAchivedCnt = 0;
                let currentTime = new Date();

                for (let j in taskList) {
                    if (taskList[j]?.organizationalUnit?._id.toString() === selectedUnit[i]) {
                        let startTime = new Date(taskList[j].startDate);
                        let endTime = new Date(taskList[j].endDate);

                        if (currentTime > endTime && taskList[j].progress < 100) {
                            notAchivedCnt++; // not achieved
                        }
                        else {
                            let workingDayMin = (endTime - startTime) * taskList[j].progress / 100;
                            let dayFromStartDate = currentTime - startTime;
                            let timeOver = workingDayMin - dayFromStartDate;
                            if (taskList[j].status === 'finished' || timeOver >= 0) {
                                intimeCnt++;
                            }
                            else {
                                delayedCnt++;
                            }
                        }
                    }

                }
                delayed.push(delayedCnt);
                intime.push(intimeCnt);
                notAchived.push(notAchivedCnt);
            }
        }
        resultInprocess = {
            dataChart: [
                delayed,
                intime,
                notAchived
            ],
        }
        result['in-process-unit-chart'] = resultInprocess
        //console.log("resultInprocess", resultInprocess)
    }

    // data cho domain chart
    if (chartArr.includes("task-results-domain-chart")) {
        let dataSearch = data["task-results-domain-chart"]
        let month = [], maxResults = ["Lớn nhất"], minResults = ["Nhỏ nhất"];

        const period = dayjs(endMonth).diff(startMonth, 'month');
        let filteredTask;
        for (let i = 0; i <= period; i++) {
            let currentMonth = dayjs(startMonth).add(i, 'month').format("YYYY-MM");
            month = [
                ...month,
                dayjs(startMonth).add(i, 'month').format("MM-YYYY"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];
            filteredTask = _filterTasksByMonthDomainChart(organizationalUnitId, dataSearch, userId, cloneDeep(organizationUnitTasks), currentMonth)
            if (filteredTask) {
                maxResults.push(filteredTask.max);
                minResults.push(filteredTask.min)
            }
        }
        month.unshift("x");

        if (month?.length) {
            resultDomain = {
                dataChart: [
                    month,
                    maxResults,
                    minResults
                ],
            }
            result["task-results-domain-chart"] = resultDomain
        }

    }
    //data cho status chart
    if (chartArr.includes('task-status-chart')) {
        let dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        let taskList = cloneDeep(organizationUnitTasks)
        taskList.map(task => {
            switch (task.status) {
                case "inprocess":
                    numberOfInprocess++;
                    break;
                case "wait_for_approval":
                    numberOfWaitForApproval++;
                    break;
                case "finished":
                    numberOfFinished++;
                    break;
                case "delayed":
                    numberOfDelayed++;
                    break;
                case "canceled":
                    numberOfCanceled++;
                    break;
            }
        });
        dataPieChart = [
            ["numberOfInprocess", numberOfInprocess],
            ["numberOfWaitForApproval", numberOfWaitForApproval],
            ["numberOfFinished", numberOfFinished],
            ["numberOfDelayed", numberOfDelayed],
            ["numberOfCanceled", numberOfCanceled],
        ];

        resultStatus = {
            dataChart: dataPieChart,
        }
        result["task-status-chart"] = resultStatus
    }

    // data cho average result chart
    if (chartArr.includes('average-results-chart')) {
        let dataSearch = data['average-results-chart']
        let month = ['x'], dataChart = {};
        let period = dayjs(endMonth).diff(startMonth, 'month');
        let filteredData;
        let legend = [];
        if (unitsNameId && unitsNameId.length !== 0 && organizationalUnitId && organizationalUnitId.length !== 0) {
            unitsNameId.filter(unit => {
                return organizationalUnitId.includes(unit.id.toString());
            }).map(unit => {
                dataChart[unit.id] = [unit.name];
                legend = [...legend, unit.name]
            })

        }
        for (let i = 0; i <= period; i++) {
            let currentMonth = dayjs(startMonth).add(i, 'month').format("YYYY-MM");
            month = [
                ...month,
                dayjs(startMonth).add(i, 'month').format("YYYY-MM-DD"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];
            filteredData = _filterTasksByMonthAverageChart(organizationalUnitId, dataSearch, cloneDeep(organizationUnitTasks), currentMonth);
            if (organizationalUnitId && organizationalUnitId.length !== 0) {
                organizationalUnitId.map(item => {
                    dataChart[item] && dataChart[item].push(filteredData[item] || 0)
                })
            }
            resultAverage = {
                dataChart: [
                    month,
                    ...Object.values(dataChart)
                ],
                legend,

            }
            result["average-results-chart"] = resultAverage
            //console.log('resultAverage :>> ', resultAverage);
        }
    }
    if (chartArr.includes('load-task-organization-chart')) {
        let dataLoadTask = [], month = [], monthArr = []
        let newData = [];
        let taskList = cloneDeep(organizationUnitTasks)
        if (taskList?.length > 0) {

            let startTime = new Date(startMonth.split("-")[0], startMonth.split('-')[1] - 1, 1);
            let endTime = new Date(endMonth.split("-")[0], endMonth.split('-')[1] ? endMonth.split('-')[1] : 1, 1);
            let m = startMonth.slice(5, 7);
            let y = startMonth.slice(0, 4);
            let period = Math.round((endTime - startTime) / 2592000000);
            let array = [];
            for (let i = 0; i < period; i++) {
                month.push(dayjs([y, m].join('-')).format("M-YYYY"));
                monthArr.push(dayjs([y, m].join('-')).format("YYYY-MM-DD"))
                m++;
                array[i] = 0;
            }
            for (let i in organizationalUnitId) {
                dataLoadTask[i] = [];
                array.fill(0, 0);
                let findUnit = unitsNameId.find(elem => (elem.id.toString() === organizationalUnitId[i]))
                if (findUnit) {
                    dataLoadTask[i].push(findUnit.name);
                }

                for (let k in taskList) {
                    if (taskList[k].organizationalUnit._id.toString() === organizationalUnitId[i]) {
                        let inprocessDay = 0;
                        let startDate = new Date(taskList[k].startDate);
                        let endDate = new Date(taskList[k].endDate);

                        if (startTime < endDate) {
                            for (let j = 0; j < period; j++) {
                                let tmpStartMonth = new Date(parseInt(month[j].split('-')[1]), parseInt(month[j].split('-')[0]) - 1, 1);
                                let tmpEndMonth = new Date(parseInt(month[j].split('-')[1]), parseInt(month[j].split('-')[0]), 0);

                                if (tmpStartMonth > startDate && tmpEndMonth < endDate) {
                                    inprocessDay = tmpEndMonth.getDate();
                                }
                                // thang dau
                                else if (tmpStartMonth < startDate && tmpEndMonth > startDate) {
                                    inprocessDay = tmpEndMonth.getDate() - startDate.getDate();
                                }
                                else if (tmpStartMonth < endDate && endDate < tmpEndMonth) {
                                    inprocessDay = endDate.getDate();
                                }
                                else {
                                    inprocessDay = 0;
                                }
                                array[j] += Math.round(inprocessDay /
                                    (taskList[k].accountableEmployees.length + taskList[k].consultedEmployees.length + taskList[k].responsibleEmployees.length))
                            }

                        }
                    }

                }

                dataLoadTask[i] = [...dataLoadTask[i], ...array];
                newData.push(dataLoadTask[i])
            }

        }
        monthArr.unshift("x")
        newData.unshift(monthArr)


        resultLoad = {
            dataChart: newData,
            legend: dataLoadTask?.map(item => item[0])
        }
        result["load-task-organization-chart"] = resultLoad
    }

    // data cho thống kê bấm giờ
    if (chartArr.includes('all-time-sheet-log-by-unit')) {
        let dataSearchForAllTimeSheetLogs = {
            ids: organizationalUnitId,
        }
        const employeeListDistribution = await UserService.getAllEmployeeOfUnitByIds(portal, dataSearchForAllTimeSheetLogs);
        let listEmployee = employeeListDistribution?.employees.filter((e) => e.userId.active === true);
        let allTimeSheet = []
        let taskList = cloneDeep(organizationUnitTasks)
        if (listEmployee) {
            for (let i in listEmployee) {
                if (listEmployee[i] && listEmployee[i].userId && listEmployee[i].userId._id)
                    allTimeSheet[listEmployee[i].userId._id.toString()] = {
                        totalhours: 0,
                        autotimer: 0,
                        manualtimer: 0,
                        logtimer: 0,
                        name: listEmployee[i].userId.name,
                        userId: listEmployee[i].userId._id.toString()
                    }
            }
        }

        let filterTimeSheetLogs = [];

        taskList?.forEach((task) => {
            if (task?.timesheetLogs.length) {
                const x = JSON.parse(JSON.stringify(task.timesheetLogs))
                filterTimeSheetLogs = x.map((tsl) => ({ ...tsl, taskName: task.name, taskId: task._id.toString() }))
            }
        })

        for (let i in filterTimeSheetLogs) {
            let autoStopped = filterTimeSheetLogs[i].autoStopped;
            let creator = filterTimeSheetLogs[i].creator;

            if (allTimeSheet[creator]) {
                if (autoStopped === 1) {
                    allTimeSheet[creator].manualtimer += filterTimeSheetLogs[i].duration
                } else if (autoStopped === 2) {
                    allTimeSheet[creator].autotimer += filterTimeSheetLogs[i].duration
                } else if (autoStopped === 3) {
                    allTimeSheet[creator].logtimer += filterTimeSheetLogs[i].duration
                }
            }
        }

        allTimeSheet = Object.entries(allTimeSheet).map(([key, value]) => {
            if (value.totalhours >= 0) {
                value.totalhours = value?.manualtimer + value?.logtimer + value?.autotimer;
            }
            return value;
        })
        let dataChart = {
            allTimeSheet,
            filterTimeSheetLogs,
            employeeLength: listEmployee.length,
        }

        resultAllTimeSheetLog = {
            dataChart: dataChart
        }
        result['all-time-sheet-log-by-unit'] = resultAllTimeSheetLog
    }
    return result





}
_filterTasksByMonthDomainChart = (units, dataSearch, userId, organizationUnitTasks, currentMonth) => {
    let a = { units, dataSearch, userId, currentMonth }
    let results = [], maxResult, minResult;
    const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };
    organizationUnitTasks.map(task => {
        task.evaluations.filter(evaluation => {
            let evaluatingMonth = dayjs(evaluation.evaluatingMonth).format("YYYY-MM");
            if (dayjs(currentMonth).isSame(evaluatingMonth)) {
                return 1;
            }
            return 0;
        }).map(evaluation => {
            evaluation.results.filter(result => {
                if (units || (result.employee === userId)) {
                    return 1;
                }
                return 0;
            }).map(result => {
                switch (dataSearch.typePoint) {
                    case TYPEPOINT.AUTOMATIC_POINT:
                        results.push(result.automaticPoint);
                        break;
                    case TYPEPOINT.EMPLOYEE_POINT:
                        results.push(result.employeePoint);
                        break;
                    case TYPEPOINT.APPROVED_POINT:
                        results.push(result.approvedPoint);
                        break;
                }

            });
        })
    });
    if (results.length === 0) {
        maxResult = null;
        minResult = null;
    } else {
        maxResult = Math.max.apply(Math, results);
        minResult = Math.min.apply(Math, results);
    }
    return {
        'max': maxResult,
        'min': minResult
    };
}

_filterTasksByMonthAverageChart = (units, dataSearch, organizationUnitTasks, currentMonth) => {
    const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };
    const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };

    let dataSumPointAndCoefficient = {}, resultAverage = {};
    let { criteria, typePoint } = dataSearch
    typePoint = parseInt(typePoint)
    criteria = parseInt(criteria)
    if (units && units.length !== 0) {
        units.map(unit => {
            dataSumPointAndCoefficient[unit] = {
                sumAutomaticPointNotCoefficient: 0, sumAutomaticPointCoefficient: 0, sumNotCoefficientAutomatic: 0, sumCoefficientAutomatic: 0,
                sumEmployeePointNotCoefficient: 0, sumEmployeePointCoefficient: 0, sumNotCoefficientEmployee: 0, sumCoefficientEmployee: 0,
                sumApprovedPointNotCoefficient: 0, sumApprovedPointCoefficient: 0, sumNotCoefficientApproved: 0, sumCoefficientApproved: 0
            }
        })
    }
    if (organizationUnitTasks) {
        organizationUnitTasks.filter(task => {
            return units.includes((task.organizationalUnit._id).toString())

        }
        ).map(task => {
            if (task?.evaluations?.length > 0) {
                task.evaluations.filter(evaluation => {
                    let evaluatingMonth = dayjs(evaluation.evaluatingMonth).format("YYYY-MM");
                    if (dayjs(currentMonth).isSame(evaluatingMonth)) {
                        return 1;
                    }

                    return 0;
                }).map(evaluation => {
                    if (evaluation.results && evaluation.results.length !== 0) {
                        evaluation.results.map(result => {
                            if (task?.organizationalUnit?._id) {
                                if (criteria === CRITERIA.COEFFICIENT) {
                                    let totalDay = 0;
                                    let startEvaluation = evaluation.startDate && new Date(evaluation.startDate);
                                    let endEvaluation = evaluation.endDate && new Date(evaluation.endDate);
                                    totalDay = Math.round((endEvaluation?.getTime() - startEvaluation?.getTime()) / 1000 / 60 / 60 / 24);

                                    if (result?.automaticPoint && result?.taskImportanceLevel && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient + result?.automaticPoint * result?.taskImportanceLevel * totalDay;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientAutomatic = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic + result?.taskImportanceLevel * totalDay;
                                    }
                                    if (result?.employeePoint && dataSumPointAndCoefficient
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient + result?.employeePoint * result?.taskImportanceLevel * totalDay;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientEmployee = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee + result?.taskImportanceLevel * totalDay;
                                    }
                                    if (result?.approvedPoint && dataSumPointAndCoefficient
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumApprovedPointCoefficient = dataSumPointAndCoefficient?.[task.organizationalUnit?._id]?.sumApprovedPointCoefficient + result?.approvedPoint * result?.taskImportanceLevel * totalDay;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientApproved = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved + result?.taskImportanceLevel * totalDay;
                                    }
                                } else {
                                    if (result?.automaticPoint
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientAutomatic >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient + result?.automaticPoint;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientAutomatic++;
                                    }
                                    if (result.employeePoint
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointNotCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientEmployee >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit._id]?.sumEmployeePointNotCoefficient + result?.employeePoint;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientEmployee++;
                                    }
                                    if (result.approvedPoint
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointNotCoefficient >= 0
                                        && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientApproved >= 0
                                    ) {
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumApprovedPointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointNotCoefficient + result?.approvedPoint;
                                        dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientApproved++;
                                    }
                                }
                            }
                        });
                    }
                })
            }
        });
    };

    if (units && units.length !== 0) {
        units.map(unit => {
            let average;
            const averageFunction = (sum, coefficient) => {
                if (coefficient !== 0) {
                    return sum / coefficient;
                } else {
                    return null;
                }
            }
            if (criteria === CRITERIA.COEFFICIENT) {
                if (dataSumPointAndCoefficient[unit]) {
                    if (typePoint === TYPEPOINT.AUTOMATIC_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumAutomaticPointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientAutomatic);
                    } else if (typePoint === TYPEPOINT.APPROVED_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumApprovedPointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientApproved);
                    } else if (typePoint === TYPEPOINT.EMPLOYEE_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumEmployeePointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientEmployee)
                    }
                }

                resultAverage[unit] = average;
            } else {
                if (dataSumPointAndCoefficient[unit]) {
                    if (typePoint === TYPEPOINT.AUTOMATIC_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumAutomaticPointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientAutomatic);
                    } else if (typePoint === TYPEPOINT.APPROVED_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumApprovedPointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientApproved);
                    } else if (typePoint === TYPEPOINT.EMPLOYEE_POINT) {
                        average = averageFunction(dataSumPointAndCoefficient[unit].sumEmployeePointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientEmployee);
                    }
                }

                resultAverage[unit] = average;
            }
        })
    }
    let object = { ...resultAverage }
    return {
        ...resultAverage
    }
}

_getDataGroupByRole = (data, group, groupName, label, count, line, status) => {
    let taskFilter = [];
    let parentCount = 0, currentParent = -1;
    let splitTask = {};

    for (let i in status) {
        for (let j in group) {
            if (group[j].status === status[i]) {
                taskFilter.push(group[j])
            }
        }
    }

    // split task
    if (taskFilter[0]) splitTask[0] = [taskFilter[0]];

    for (let i in taskFilter) {
        let left = dayjs(taskFilter[i].startDate);
        let right = dayjs(taskFilter[i].endDate);
        let intersect;

        if (i == 0) continue;
        for (let parent in splitTask) {
            let currentLine = splitTask[parent];

            for (let j in currentLine) {
                // Kiem tra xem co trung cong viec nao k
                intersect = false;
                let currentLeft = dayjs(currentLine[j].startDate);
                let currentRight = dayjs(currentLine[j].endDate);

                if ((left >= currentLeft && left <= currentRight) || (currentLeft >= left && currentLeft <= right)) {
                    intersect = true;
                    break;
                }
            }

            if (!intersect) {
                splitTask[parent].push(taskFilter[i]);
                break;
            }
        }
        if (intersect) {
            let nextId = Object.keys(splitTask).length;

            splitTask[nextId] = [];
            splitTask[nextId].push(taskFilter[i])
        }
    }

    let taskFilterSplit = [];
    for (let key in splitTask) {
        if (splitTask[key]) {
            for (let i in splitTask[key]) {
                if (splitTask[key][i]) {
                    splitTask[key][i].parentSplit = parseInt(key);
                    taskFilterSplit.push(splitTask[key][i]);
                }
            }
        }
    }

    for (let i in taskFilterSplit) {
        let start = dayjs(taskFilterSplit[i].startDate);
        let end = dayjs(taskFilterSplit[i].endDate);
        let now = dayjs(new Date());
        let duration = end.diff(start, 'day');
        if (duration == 0) duration = 1;
        let process = 0;

        // Tô màu công việc
        if (taskFilterSplit[i].status != "inprocess") {
            process = 3;
        }
        else if (now > end) {
            process = 2; // Quá hạn
            count.notAchived++;
        }
        else {
            let processDay = Math.floor(taskFilterSplit[i].progress * duration / 100);
            let uptonow = now.diff(start, 'days');

            if (uptonow > processDay) {
                process = 0; // Trễ hạn
                count.delay++;
            }
            else if (uptonow <= processDay) {
                process = 1; // Đúng hạn
                count.intime++;
            }
        }
        if (taskFilterSplit[i].parentSplit != currentParent) {

            data.push({
                id: `${groupName}-${taskFilterSplit[i].parentSplit}`,
                text: "",
                role: i == 0 ? label : "",
                start_date: null,
                duration: null,
                render: "split"
            });
            currentParent++;
            line++;
        }

        data.push({
            id: `${groupName}-${taskFilterSplit[i]._id}`,
            text: taskFilterSplit[i].status == "inprocess" ? `${taskFilterSplit[i].name} - ${taskFilterSplit[i].progress}%` : `${taskFilterSplit[i].name}`,
            start_date: dayjs(taskFilterSplit[i].startDate).format("YYYY-MM-DD HH:mm"),
            // duration: duration,
            end_date: dayjs(taskFilterSplit[i].endDate).format("YYYY-MM-DD HH:mm"),
            progress: taskFilterSplit[i].status === "inprocess" ? taskFilterSplit[i].progress / 100 : 0,
            process: process,
            parent: `${groupName}-${taskFilterSplit[i].parentSplit}`
        });
    }

    return { data, count, line };
}
_countTask = (tasklist, name) => {
    let confirmedTask = [], noneUpdateTask = [], intimeTask = [], delayTask = [], overdueTask = [], taskFinished = [], taskInprocess = [];

    for (let i in tasklist) {
        let start = dayjs(tasklist[i]?.startDate);
        let end = dayjs(tasklist[i]?.endDate);
        let lastUpdate = dayjs(tasklist[i]?.updatedAt);
        let now = dayjs(new Date());
        let duration = end.diff(start, 'day');
        let uptonow = now.diff(lastUpdate, 'day');
        if (tasklist[i]?.confirmedByEmployees?.length) {
            confirmedTask = [...confirmedTask, tasklist[i]];
        }
        if (uptonow >= 7) {
            noneUpdateTask = [...noneUpdateTask, tasklist[i]];
        }
        if (tasklist[i]?.status === 'inprocess') {
            if (now > end) {
                // Quá hạn
                overdueTask = [...overdueTask, tasklist[i]];
            }
            else {
                let processDay = Math.floor(tasklist[i]?.progress * duration / 100);
                let startToNow = now.diff(start, 'day');

                if (startToNow > processDay) {
                    // Trễ hạn
                    delayTask = [...delayTask, tasklist[i]];
                }
                else if (startToNow <= processDay) {
                    // Đúng hạn
                    intimeTask = [...intimeTask, tasklist[i]];
                }
            }
        }
        if (tasklist[i] && tasklist[i].status === "finished") {
            taskFinished = [...taskFinished, tasklist[i]];
        }
        if (tasklist[i] && tasklist[i].status === "inprocess") {
            taskInprocess = [...taskInprocess, tasklist[i]];
        }
    }
    return {
        name: name ? name : "",
        totalTask: tasklist.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        confirmedTask: confirmedTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        noneUpdateTask: noneUpdateTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        intimeTask: intimeTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        delayTask: delayTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        overdueTask: overdueTask.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        taskFinished: taskFinished.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        taskInprocess: taskFinished.map(a => ({ _id: a._id, name: a.name, startDate: a.startDate, endDate: a.endDate, status: a.status, progress: a.progress })),
        organization: true,
        show: true,
    }
}

_processTask = (task) => {
    let propNames = ['totalTask'];
    let start = dayjs(task?.startDate);
    let end = dayjs(task?.endDate);
    let lastUpdate = dayjs(task?.updatedAt);
    let now = dayjs(new Date());
    let duration = end.diff(start, 'day');
    let uptonow = now.diff(lastUpdate, 'day');
    if (task?.confirmedByEmployees?.length) {
        propNames.push('confirmedTask');
    }
    if (uptonow >= 7) {
        propNames.push('noneUpdateTask');
    }
    if (task?.status === 'inprocess') {
        if (now > end) {
            // Quá hạn
            propNames.push('overdueTask');
        }
        else {
            let processDay = Math.floor(task?.progress * duration / 100);
            let startToNow = now.diff(start, 'day');

            if (startToNow > processDay) {
                // Trễ hạn
                propNames.push('delayTask');
            }
            else if (startToNow <= processDay) {
                // Đúng hạn
                propNames.push('intimeTask');
            }
        }
    }

    if (task && task.status === "finished") {
        propNames.push('taskFinished');
    }
    if (task && task.status === "inprocess") {
        propNames.push('taskInprocess');
    }
    return propNames

}


_freshListEmployee = (listEmployee) => {
    let arr = [];
    let result = [];
    listEmployee && listEmployee.forEach((x, index) => {
        if (x.managers) {
            for (const [key, value] of Object.entries(x.managers)) {
                if (value.members && value.members.length > 0) {
                    value.members.forEach((o) => {
                        arr = [...arr, o];
                    });
                }
            }
        }

        if (x.deputyManagers) {
            for (const [key, value] of Object.entries(x.deputyManagers)) {
                if (value.members && value.members.length > 0) {
                    value.members.forEach((o) => {
                        arr = [...arr, o];
                    });
                }
            }
        }

        if (x.employees) {
            for (const [key, value] of Object.entries(x.employees)) {
                if (value.members && value.members.length > 0) {
                    value.members.forEach((o) => {
                        arr = [...arr, o];
                    });
                }
            }
        }

        // Lọc các nhân viên trùng nhau sau khi thực hiện ở trên
        // vì 1 nhân viên có thể có nhiều chức ở các đơn vị khác nhau nên chỉ lọc lấy 1 cái
        const seen = new Set();
        const filteredArr = arr.filter((el) => {
            const duplicate = seen.has(el._id);
            seen.add(el._id);
            return !duplicate;
        });
        result = [...filteredArr];
    })
    return result;
}