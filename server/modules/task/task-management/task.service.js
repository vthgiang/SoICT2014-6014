const mongoose = require("mongoose");
const moment = require("moment");
const nodemailer = require("nodemailer");

const { Task, TaskTemplate, OrganizationalUnit, User, Company, UserRole } = require('../../../models');
const OrganizationalUnitService = require(`../../super-admin/organizational-unit/organizationalUnit.service`);
const overviewService = require(`../../kpi/employee/management/management.service`);

const { sendEmail } = require(`../../../helpers/emailHelper`);
const { connect } = require(`../../../helpers/dbHelper`);

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
                date: { $gte: start, $lte: end }
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
            taskMerge.map(item => {
                if (item.filter) {
                    let replacer = new RegExp(item.code, 'g')
                    item.filter = eval(item.filter.replace(replacer, item.value));
                } else {
                    item.filter = true;
                }
                return item;
            })
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
        });


        newResult.map(o => {
            if (o.taskInformations.some(item => (item.filter === true))) {
                return o;
            } else {
                newResult = [];
            }
        })
        return newResult;
    } else {
        return result;
    }
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
 * Lấy công việc theo người dùng ,...$_id
 * @task dữ liệu trong params
 */
exports.getPaginatedTasks = async (portal, task) => {
    let { perPage, number, role, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime } = task;
    let taskList;
    perPage = Number(perPage);
    let page = Number(number);
    let roleArr = [];
    if (role) {
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
        ];
    }


    let keySearch = {
        $or: roleArr,
        isArchived: false
    };
    let keySearchSpecial = {}, keySearchPeriod = {};

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

    if (Array.isArray(special)) {
        let checkStore = special.some(node => node === 'stored');
        if(checkStore) {
            keySearch = {
                ...keySearch,
                isArchived: true
            };
        }
        let checkCurrentMonth = special.some(node => node === 'currentMonth');
        if(checkCurrentMonth){
            let now = new Date();
            let currentYear = now.getFullYear();
            let currentMonth = now.getMonth()+1;
            let start = new Date(`${currentYear}-${currentMonth}`); //ngày cuối cùng của tháng trước
            let end = new Date(currentYear, currentMonth); // ngày cuối cùng của tháng hiện tại

            keySearchSpecial = {
                $or: [
                    { 'endDate': { $lte: end, $gt: start } },
                    { 'startDate': { $lte: end, $gt: start } },
                    { 'startDate': { $lte: start }, 'endDate': { $gte: end } }
                ]
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
        keySearchPeriod = {
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    } else {

        if (startDate) {
            let checkDate = Date.parse(endDate);
            if (checkDate) {
                keySearch = {
                    ...keySearch,
                    startDate: {
                        $gt: new Date(startDate)
                    }
                }
            } else {
                let startTime = startDate.split("-");
                let start = new Date(startTime[1], startTime[0] - 1, 1);
                keySearch = {
                    ...keySearch,
                    startDate: {
                        $gt: start
                    }
                }
            }
        }
        if (endDate) {
            let checkDate = Date.parse(endDate);
            if (checkDate) {
                keySearch = {
                    ...keySearch,
                    endDate: {
                        $lte: new Date(endDate)
                    }
                }
            } else {
                let endTime = endDate.split("-");
                let end = new Date(endTime[1], endTime[0], 1);
                keySearch = {
                    ...keySearch,
                    endDate: {
                        $lte: end
                    }
                }
            }
        }

    }

    let optionQuery = {
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }
    taskList = await Task(connect(DB_CONNECTION, portal)).find(optionQuery).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate([
            { path: "organizationalUnit creator parent responsibleEmployees" },
            { path: "timesheetLogs.creator", select: "name" },
        ]);

    let totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments(optionQuery);
    let totalPages = Math.ceil(totalCount / perPage);

    return {
        "tasks": taskList,
        "totalPage": totalPages
    };
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
    let keySearchSpecial = {}, keySearchPeriod = {};

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
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }

    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }

    responsibleTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent responsibleEmployees" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    });
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
    let keySearchSpecial = {}, keySearchPeriod = {};

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
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }
    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }
    accountableTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": accountableTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc tư vấn theo id người dùng
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
    let keySearchSpecial = {}, keySearchPeriod = {};

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
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }
    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }
    consultedTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    });
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
    let keySearchSpecial = {}, keySearchPeriod = {};

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
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }

    creatorTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage).populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
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
    let keySearchSpecial = {}, keySearchPeriod = {};

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
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }
    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }

    informedTasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": informedTasks,
        "totalPage": totalPages
    };
}

/**
 * Lấy công việc quan sát theo id người dùng
 */
exports.getPaginatedTasksByUser = async (portal, task, type = "paginated_task_by_user") => {
    var { perPage, number, user, organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime, isAssigned } = task;
    var tasks;
    var perPage = Number(perPage);
    var page = Number(number);
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
    let keySearchSpecial = {}, keySearchPeriod = {};

    if (organizationalUnit) {
        if (type === "paginated_task_by_unit") {
            keySearch = {
                ...keySearch,
                $or: [
                    { organizationalUnit: { $in: organizationalUnit } },
                    { "collaboratedWithOrganizationalUnits.organizationalUnit": { $in: organizationalUnit } },
                ],
            };
        } else {
            keySearch = {
                ...keySearch,
                organizationalUnit: {
                    $in: organizationalUnit,
                }
            };
        }
    }

    if (isAssigned && JSON.parse(isAssigned) !== -1) {
        keySearch = {
            ...keySearch,
            collaboratedWithOrganizationalUnits: {
                $elemMatch: {
                    "organizationalUnit": organizationalUnit,
                    "isAssigned": JSON.parse(isAssigned)
                }
            }
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
            else {
                let now = new Date();
                let currentYear = now.getFullYear();
                let currentMonth = now.getMonth();
                let endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
                let endOfLastMonth = new Date(currentYear, currentMonth);

                keySearchSpecial = {
                    $or: [
                        { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth } },
                        { $and: [{ 'endDate': { $gte: endOfCurrentMonth } }, { 'startDate': { $lte: endOfLastMonth } }] }
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

    if (aPeriodOfTime && JSON.parse(aPeriodOfTime)) {
        keySearchPeriod = {
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
                    $gte: start,
                    $lt: end
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
                    $gte: start,
                    $lt: end
                }
            }
        }
    }
    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }

    tasks = await Task(connect(DB_CONNECTION, portal)).find({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    }).sort({ 'createdAt': 'asc' })
        .skip(perPage * (page - 1)).limit(perPage)
        .populate({ path: "organizationalUnit creator parent" });

    var totalCount = await Task(connect(DB_CONNECTION, portal)).countDocuments({
        $and: [
            keySearch,
            keySearchSpecial,
            keySearchPeriod
        ]
    });
    var totalPages = Math.ceil(totalCount / perPage);
    return {
        "tasks": tasks,
        "totalPage": totalPages
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
exports.getAllTaskOfOrganizationalUnitByMonth = async (portal, task) => {
    var { organizationalUnitId, startDateAfter, endDateBefore } = task;
    var organizationUnitTasks;
    var keySearch = {};

    if (organizationalUnitId) {
        // if (organizationalUnitId !== '[]') {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnitId,
            }
        };
    }

    // if (startDateAfter) {
    //     let startTimeAfter = startDateAfter.split("-");
    //     let start;


    //     if (startTimeAfter[0] > 12) start = new Date(startTimeAfter[0], startTimeAfter[1] - 1, 1);
    //     else start = new Date(startTimeAfter[1], startTimeAfter[0] - 1, 1);

    //     keySearch = {
    //         ...keySearch,
    //         endDate: {
    //             $gte: start
    //         }
    //     }
    // }

    // if (endDateBefore) {
    //     let endTimeBefore = endDateBefore.split("-");
    //     let end;
    //     if (endTimeBefore[0] > 12) end = new Date(endTimeBefore[0], endTimeBefore[1], 1);
    //     else end = new Date(endTimeBefore[1], endTimeBefore[0], 1);

    //     keySearch = {
    //         ...keySearch,
    //         startDate: {
    //             $lt: end
    //         }
    //     }
    // }
    organizationUnitTasks = await Task(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'asc' })
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" });
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
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" }).lean();

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
        .populate({ path: "organizationalUnit creator parent responsibleEmployees" }).lean();
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
    console.log('taskUrgent', taskUrgent.map(x => x.name));
    console.log('taskNeedToDo', taskNeedToDo.map(x => x.name));

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
    task = await task.populate("organizationalUnit creator parent").execPopulate();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'vnist.qlcv@gmail.com', pass: 'qlcv123@' }
    });

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
    email.push("trinhhong102@gmail.com");

    var body = `<a href="${process.env.WEBSITE}/task?taskId=${task._id}" target="_blank" title="${process.env.WEBSITE}/task?taskId=${task._id}"><strong>${task.name}</strong></a></p> ` +
        `<h3>Nội dung công việc</h3>` +
        // `<p>Tên công việc : <strong>${task.name}</strong></p>` +
        `<p>Mô tả : ${task.description}</p>` +
        `<p>Người thực hiện</p> ` +
        `<ul>${res.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>`+
        `<p>Người phê duyệt</p> ` +
        `<ul>${acc.map((item) => {
            return `<li>${item.name} - ${item.email}</li>`
        })}
                    </ul>` +
        `${con.length > 0 ? `<p>Người tư vấn</p> ` +
            `<ul>${con.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
                    </ul>` : ""}` +
        `${inf.length > 0 ? `<p>Người quan sát</p> ` +
            `<ul>${inf.map((item) => {
                return `<li>${item.name} - ${item.email}</li>`
            })}
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
        formula = "progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100"
    }

    let getValidObjectId = (value) => {
        return mongoose.Types.ObjectId.isValid(value) ? value : undefined;
    }
    let taskProject = (taskTemplate && taskTemplate.taskProject) ? getValidObjectId(taskTemplate.taskProject) : getValidObjectId(task.taskProject);

    var newTask = await Task(connect(DB_CONNECTION, portal)).create({ //Tạo dữ liệu mẫu công việc
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
        taskInformations: taskTemplate ? taskTemplate.taskInformations : [],
        taskActions: taskTemplate ? cloneActions : [],
        parent: (task.parent === "") ? null : task.parent,
        level: level,
        responsibleEmployees: task.responsibleEmployees,
        accountableEmployees: task.accountableEmployees,
        consultedEmployees: task.consultedEmployees,
        informedEmployees: task.informedEmployees,
        confirmedByEmployees: task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees).includes(task.creator) ? task.creator : [],
        taskProject
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
exports.deleteTask = async (portal, id) => {
    //req.params.id
    let tasks = await Task(connect(DB_CONNECTION, portal)).findById(id);
    if (tasks.taskTemplate !== null) {
        await TaskTemplate(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
            tasks.taskTemplate, { $inc: { 'numberOfUse': -1 } }, { new: true }
        );
    }

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
            status: "inprocess"
        })
    }

    if (data.data == "organizationUnit") {
        for (let i in data.organizationUnitId) {
            var organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ _id: data.organizationUnitId[i] })
            var test = await Task(connect(DB_CONNECTION, portal)).find(
                { organizationalUnit: organizationalUnit._id, status: "inprocess" },
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
exports.getAllTaskOfChildrenOrganizationalUnit = async (portal, companyId, roleId, month, organizationalUnitId) => {

    let tasksOfChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await overviewService.getAllChildrenOrganizational(portal, companyId, roleId, organizationalUnitId);

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

/**
 * Lấy thông tin thống kê công việc của người dùng theo vai trò
 * @param {*} portal 
 * @param {*} userId 
 * @param {*} roleId 
 */
exports.getTaskAnalysOfUser = async (portal, userId, type) => {

    let tasks = await Task(connect(DB_CONNECTION, portal)).find({
        $or: [
            { responsibleEmployees: userId }, // người thực hiện
            { accountableEmployees: userId }, // người phê duyệt
            { consultedEmployees: userId }, // người tư vấn
            { informedEmployees: userId }, // người quan sát
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
    console.log("my", month, year)
    let beginOfMonth = new Date(`${year}-${month}`);
    let beginOfNextMonth = new Date(year, month);
    let tasks = await Task(connect(DB_CONNECTION, portal))
        .find({
            "timesheetLogs.creator": userId,
            "timesheetLogs.startedAt": { $gte: beginOfMonth, $lt: beginOfNextMonth },
            "timesheetLogs.stoppedAt": { $exists: true }
        });
    console.log("TASKS", tasks)
    let timesheetlogs = [];
    for(let i=0; i<tasks.length; i++){
        let ts = tasks[i].timesheetLogs;
        console.log("TASK", ts)
        if(Array.isArray(ts)){
            for(let j=0; j<ts.length; j++){
                let tslogs = ts[j];
                console.log("TSSSS", tslogs)
                if(tslogs.creator.toString() === userId.toString()){
                    timesheetlogs.push(tslogs);
                }
            }
        }
    }

    return timesheetlogs;
}