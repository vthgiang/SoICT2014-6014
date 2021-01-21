const { split, isElement } = require("lodash");
const mongoose = require("mongoose");
const { getAllEmployeeOfUnitByRole } = require("../../../super-admin/user/user.service");

const {
    WorkSchedule, ManufacturingMill, ManufacturingWorks, ManufacturingCommand, OrganizationalUnit
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const { getUserByWorksManageRole } = require("../manufacturingWorks/manufacturingWorks.service");

// Hàm lấy ra tổng số ngày trong tháng
function getAllDayOfMonth(month) {
    let arrayYearMonth = split(month, "-");
    let lastDayOfMonth = new Date(arrayYearMonth[0], arrayYearMonth[1], 0);
    return lastDayOfMonth.getDate();
}

// Hàm lấy ra tất cả các nhân viên trong 1 array nhà máy có vai trò là employee

async function getAllEmployeeOfManufacturingWorks(query = undefined, portal, currentRole = undefined) {
    // tra ve mang id cac employee thoa man
    let employees = [];
    let option = {
        status: 1
    };
    if (query && query.currentRole) {
        let listWorksIds = await getListWorksIdsByCurrentRole(query.currentRole, portal);
        option._id = {
            $in: listWorksIds
        }
    }
    if (query && query.works) {
        option._id = {
            $in: query.works
        }
    }

    // currentRole này chỉ để phục vụ việc tạo lịch sản xuất cho tất cả công nhân
    if (currentRole) {
        let listWorksIds = await getListWorksIdsByCurrentRole(currentRole, portal);
        option._id = {
            $in: listWorksIds
        }
    }

    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([{
            path: "organizationalUnit",
        }]);
    for (let i = 0; i < manufacturingWorks.length; i++) {
        let emplyeeArray = await getAllEmployeeOfUnitByRole(portal, manufacturingWorks[i].organizationalUnit.employees);
        employees = [...employees, ...emplyeeArray]
    }

    if (query && query.name) {
        employees = employees.filter(e => e.userId.name.includes(query.name));
    }

    // Nếu currentRole = undefined thì lấy ra hết không chỉ mỗi Id

    if (query) {
        employees = employees.map(e => e.userId._id)
    } else {
        employees = employees.map(e => e.userId)
    }

    return employees;

}



// Function kiểm tra xem _id của đối tượng có năm trong array hay không

function checkIdObjectInArray(array, object) {
    for (let i = 0; i < array.length; i++) {
        if (String(array[i]) == String(object._id)) {
            return true;
        }
    }
    return false;
}

// Hàm trả về danh sách các xưởng mà 1 role truyền vào có thể được quyền quản lý

async function getListWorksIdsByCurrentRole(currentRole, portal) {
    // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    return listWorksId;

}

// Hàm tạo một lịch trong tháng ứng với manufacturingMill hoặc employee
exports.createWorkSchedule = async (data, portal) => {
    if (!data.month || !data.numberOfTurns) {
        throw Error("data is not defined")
    }
    if (!data.manufacturingMill && !data.user && !data.allManufacturingMill && !data.allUser) {
        throw Error("data is not defined")
    }
    let month = new Date(data.month);
    // Check xem lich ton tai chua
    let checkWorkSchedule = [];
    if (data.manufacturingMill) {
        checkWorkSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
            manufacturingMill: data.manufacturingMill,
            month: month
        });
    }
    if (data.user) {
        checkWorkSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
            user: data.user,
            month: month
        });
    }
    if (checkWorkSchedule.length) {
        return -1;
    } else {
        let numberDaysOfMonth = getAllDayOfMonth(data.month);
        // Một item là một mảng có 28, 29, 30 hoặc 31 phần tử null
        let itemOfTurns = [];
        for (let i = 0; i < numberDaysOfMonth; i++) {
            itemOfTurns[i] = null;
        }

        // Push các itemOfturns vào mảng các turns
        let numberOfTurns = data.numberOfTurns;
        let turns = []
        for (let i = 0; i < numberOfTurns; i++) {
            turns[i] = itemOfTurns;
        }


        let workSchedules = [];

        // Code them cho nhieu xuong
        if (data.allManufacturingMill) {
            // Lấy ra tất cả lịch của các xưởng trong tháng truyền vào
            let manufacturingMillSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
                manufacturingMill: {
                    $ne: null
                },
                month: month
            });
            let arrayMillId = manufacturingMillSchedules.map(x => x.manufacturingMill);
            // lấy ra nhà máy theo currentRole
            let listWorksIds = [];
            if (data.currentRole) {
                listWorksIds = await getListWorksIdsByCurrentRole(data.currentRole, portal);
            }
            // Lấy ra các xưởng đang hoạt động chưa được sếp lịch trong tháng truyền vào
            let manufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
                _id: {
                    $nin: arrayMillId
                },
                manufacturingWorks: {
                    $in: listWorksIds
                },
                status: 1
            });
            // let tasks = [];
            // for (let i = 0; i < manufacturingMills.length; i++) {
            //     tasks.push(WorkSchedule(connect(DB_CONNECTION, portal)).create({
            //         employee: data.employee,
            //         manufacturingMill: manufacturingMills[i],
            //         month: month,
            //         turns: turns
            //     }))
            // }
            // workSchedules = await Promise.all(tasks);
            if (manufacturingMills.length == 0) {
                return -1;
            }
            let schedules = [];
            for (let i = 0; i < manufacturingMills.length; i++) {
                schedules.push({
                    manufacturingMill: manufacturingMills[i],
                    month: month,
                    turns: turns
                });
            }
            workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).insertMany(schedules);

        }
        else if (data.allUser) {
            // Lấy ra tất cả lịch của các công nhân trong tháng truyền vào
            let workerSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
                user: {
                    $ne: null
                },
                month: month
            });
            let arrayUserId = workerSchedules.map(x => x.user);
            // Lấy ra tất cả các nhân viên của các nhà máy luôn
            let workers = await getAllEmployeeOfManufacturingWorks(undefined, portal, data.currentRole);
            // Lấy ra các công nhân của các nhà máy mà chưa được sếp lịch trong tháng
            let arrayUserIdNotHaveSchedule = [];
            for (let i = 0; i < workers.length; i++) {
                if (checkIdObjectInArray(arrayUserId, workers[i])) {
                    continue;
                }
                arrayUserIdNotHaveSchedule.push(workers[i]);
            }

            if (arrayUserIdNotHaveSchedule.length == 0) {
                return -1;
            }
            let schedules = [];
            for (let i = 0; i < arrayUserIdNotHaveSchedule.length; i++) {
                schedules.push({
                    user: arrayUserIdNotHaveSchedule[i],
                    month: month,
                    turns: turns
                });
            }
            workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).insertMany(schedules);

        }
        else {
            let newWorkSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).create({
                user: data.user,
                manufacturingMill: data.manufacturingMill,
                month: month,
                turns: turns
            });

            let workSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).findById({ _id: newWorkSchedule._id })
                .populate([{
                    path: 'manufacturingMill'
                }, {
                    path: 'user'
                }])
            workSchedules.push(workSchedule);
        }


        return { workSchedules }
    }
}


exports.getWorkSchedules = async (query, portal) => {
    if (!query.object) {
        throw Error('params object is required');
    }
    if (query.object !== 'manufacturingMill' && query.object !== 'user') {
        throw Error('params object is manufacturingMill or user');
    }

    let { page, limit } = query;
    let options = {};

    if (query.month) {
        options.month = query.month;
    }

    if (query.object == 'manufacturingMill') {
        options.manufacturingMill = {
            $ne: null
        }
        if (query.manufacturingMill) {
            options.manufacturingMill = query.manufacturingMill
        }

        // Phân loại xưởng sản xuất
        let searchMill = {
            status: 1
        };
        // xử lý việc phân quyền dữ liệu
        if (query.currentRole) {
            let listWorksId = await getListWorksIdsByCurrentRole(query.currentRole, portal);
            // Lấy ra tất cả các xưởng mà quyền này được xem
            let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
                manufacturingWorks: {
                    $in: listWorksId
                }
            });

            let listMillIds = listManufacturingMills.map(x => x._id);

            searchMill = {
                _id: {
                    $in: listMillIds
                },
                status: 1
            }
        }

        if (query.code) {
            searchMill.code = new RegExp(query.code, "i");
        }
        if (searchMill) {
            let manufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find(searchMill);
            let millId = manufacturingMills.map(x => x._id);
            options.manufacturingMill = {
                ...options.manufacturingMill,
                $in: millId
            }
        }

        if (!limit || !page) {

            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find(options)
                .populate([{
                    path: 'manufacturingMill'
                }]);

            return { workSchedules };
        } else {
            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal))
                .paginate(options, {
                    page,
                    limit,
                    populate: [{
                        path: "manufacturingMill"
                    }]
                });
            for (let i = 0; i < workSchedules.docs.length; i++) {
                for (let j = 0; j < workSchedules.docs[i].turns.length; j++) {
                    for (let k = 0; k < workSchedules.docs[i].turns[j].length; k++) {
                        if (workSchedules.docs[i].turns[j][k] != null) {
                            let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(workSchedules.docs[i].turns[j][k])
                                .populate([{
                                    path: "good",
                                    select: "code name baseUnit numberExpirationDate materials",
                                    populate: [{
                                        path: "materials.good",
                                        select: "code name baseUnit",
                                    }]
                                }]);
                            workSchedules.docs[i].turns[j][k] = manufacturingCommand;
                        }
                    }
                }
            }
            return { workSchedules }
        }

    }

    if (query.object == 'user') {
        options.user = {
            $ne: null
        }
        if (query.user) {
            options.user = query.user
        }

        // Xử lý tìm ra mảng các employee với mảng manufacturingWorks, employeeNumber truyền vào
        // Tìm tất cả các nhân viên trong các nhà máy
        // Lọc các nhân viên đó theo code
        // Tạo mảng id để workSchedule filter

        let employeeIds = await getAllEmployeeOfManufacturingWorks(query, portal);
        options.user = {
            ...options.user,
            $in: employeeIds
        }




        if (!limit | !page) {
            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find(options)
                .populate([{
                    path: 'user', select: 'name email'
                }]);

            return { workSchedules };
        } else {
            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal))
                .paginate(options, {
                    page: page,
                    limit: limit,
                    populate: [{
                        path: 'user', select: 'name email'
                    }]
                });
            for (let i = 0; i < workSchedules.docs.length; i++) {
                for (let j = 0; j < workSchedules.docs[i].turns.length; j++) {
                    for (k = 0; k < workSchedules.docs[i].turns[j].length; k++) {
                        if (workSchedules.docs[i].turns[j][k] != null) {
                            let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(workSchedules.docs[i].turns[j][k])
                                .populate([{
                                    path: "good",
                                    select: "code name baseUnit numberExpirationDate materials",
                                    populate: [{
                                        path: "materials.good",
                                        select: "code name baseUnit",
                                    }]
                                }]);
                            workSchedules.docs[i].turns[j][k] = manufacturingCommand;
                        }
                    }
                }
            }

            return { workSchedules }
        }
    }
}

exports.getWorkSchedulesByMillId = async (id, portal) => {
    const workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
        manufacturingMill: id
    });
    for (let i = 0; i < workSchedules.length; i++) {
        for (let j = 0; j < workSchedules[i].turns.length; j++) {
            for (let k = 0; k < workSchedules[i].turns[j].length; k++) {
                if (workSchedules[i].turns[j][k] != null) {
                    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(workSchedules[i].turns[j][k])
                        .populate([{
                            path: "good",
                            select: "code name baseUnit numberExpirationDate materials",
                            populate: [{
                                path: "materials.good",
                                select: "code name baseUnit",
                            }]
                        }]);
                    workSchedules[i].turns[j][k] = manufacturingCommand;
                }
            }
        }
    }

    return { workSchedules }
}


function getStartMonthEndMonthFromString(stringStartDate, stringEndDate) {
    let arrayStartDate = stringStartDate.split('-');
    let year = arrayStartDate[2];
    let month = arrayStartDate[1];
    let day = arrayStartDate[0];
    const startDate = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var startMonth = moment(startDate).startOf('month');

    let arrayEndDate = stringEndDate.split('-');
    year = arrayEndDate[2];
    month = arrayEndDate[1];
    day = arrayEndDate[0];
    const endDate = new Date(year, month - 1, day);
    // end day of createdAt
    var endMonth = moment(endDate).endOf('month');

    return [startMonth, endMonth];
}

exports.getWorkSchedulesOfManufacturingWork = async (query, portal) => {
    const { manufacturingMills, startDate, endDate } = query;
    let options = {};
    if (startDate && endDate) {
        let arrayMonth = getStartMonthEndMonthFromString(startDate, endDate);
        options.month = {
            '$gte': arrayMonth[0],
            '$lte': arrayMonth[1]
        }
    }

    if (manufacturingMills) {
        options.manufacturingMill = {
            $in: manufacturingMills
        }
        options.user = null
    }
    let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find(options).sort({ 'month': 'asc' });
    for (let i = 0; i < workSchedules.length; i++) {
        for (let j = 0; j < workSchedules[i].turns.length; j++) {
            for (let k = 0; k < workSchedules[i].turns[j].length; k++) {
                if (workSchedules[i].turns[j][k] != null) {
                    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(workSchedules[i].turns[j][k])
                        .populate([{
                            path: "good",
                            select: "code name baseUnit numberExpirationDate materials",
                            populate: [{
                                path: "materials.good",
                                select: "code name baseUnit",
                            }]
                        }]);
                    workSchedules[i].turns[j][k] = manufacturingCommand;
                }
            }
        }
    }

    return { workSchedules }
}

exports.getWorkerFromArraySchedules = async (query, portal) => {
    const {
        arrayWorkerSchedules, currentRole
    } = query;
    if (arrayWorkerSchedules && arrayWorkerSchedules.length == 0) {
        let workers = [];
        return { workers }
    }
    // Lấy ra danh sách các công nhân thuộc nhà máy
    const listEmployees = await getUserByWorksManageRole(currentRole, portal);
    const employees = listEmployees.employees;
    // Lấy ra danh sách Id công nhân thuộc nhà máy
    const listEmployeeIds = employees.map(x => x.userId._id);
    // filter ra cac thang
    let arrayMonth = [];
    for (let i = 0; i < arrayWorkerSchedules.length; i++) {
        let month = JSON.parse(arrayWorkerSchedules[i]).month;
        if (!arrayMonth.includes(month)) {
            arrayMonth.push(month);
        }
    }
    arrayMonth = arrayMonth.map(x =>
        new Date(formatToTimeZoneDate(x))
    );
    // Lấy ra tất cả các lịch công nhân nhà máy trong tháng
    const workerSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
        user: {
            $in: listEmployeeIds
        },
        month: {
            $in: arrayMonth
        }
    }).populate([{
        path: "user"
    }]);
    // Xử lý tìm ra các lịch rảnh trong các ca truyền vào
    let listWorkSchedules = [];
    for (let i = 0; i < workerSchedules.length; i++) {
        if (checkWorkerSchedules(workerSchedules[i], arrayWorkerSchedules)) {
            listWorkSchedules.push(workerSchedules[i]);
        }
    }
    // Xử lý tìm ra các người rảnh trong đó
    let workers = [];
    let workerIds = [];
    for (let i = 0; i < listWorkSchedules.length; i++) {
        if (!workerIds.includes(listWorkSchedules[i].user._id)) {
            workers.push(listWorkSchedules[i].user);
            workerIds.push(listWorkSchedules[i].user._id);
        }
    }
    // Trả về danh sách người rảnh
    return { workers }
}


// Hàm format to YYYY-MM để có thể dụng new Date
function formatToTimeZoneDate(stringDate) {
    let dateArray = stringDate.split("-");
    if (dateArray.length == 3) {
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        return `${year}-${month}-${day}`
    }
    else if (dateArray.length == 2) {
        let month = dateArray[0];
        let year = dateArray[1];
        return `${year}-${month}`
    }
}

function checkWorkerSchedules(workerSchedule, arrayWorkerSchedules) {
    let result = true;
    for (let i = 0; i < arrayWorkerSchedules.length; i++) {
        ObjectWorker = JSON.parse(arrayWorkerSchedules[i]);
        if (workerSchedule.turns[ObjectWorker.index1][ObjectWorker.index2] !== null) {
            result = false;
        }
    }
    return result;
}


exports.bookingManyManufacturingMills = async (listMillsSchedules, portal) => {
    for (let i = 0; i < listMillsSchedules.length; i++) {
        let schedule = await WorkSchedule(connect(DB_CONNECTION, portal)).findById(listMillsSchedules[i]._id);
        for (let j = 0; j < listMillsSchedules[i].turns.length; j++) {
            for (let k = 0; k < listMillsSchedules[i].turns[j].length; k++) {
                if (listMillsSchedules[i].turns[j][k] != null && !listMillsSchedules[i].turns[j][k]._id) {
                    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
                        .findOne({
                            code: listMillsSchedules[i].turns[j][k].code
                        })
                    schedule.turns[j][k] = manufacturingCommand._id;
                    await schedule.markModified("turns");
                    await schedule.save();
                }
            }
        }
    }
    return null;
}

exports.bookingManyWorkerToCommand = async (arrayWorkerSchedules, portal) => {
    for (let i = 0; i < arrayWorkerSchedules.length; i++) {
        let listWorkerSchedules = await WorkSchedule(connect(DB_CONNECTION, portal))
            .find({
                user: {
                    $in: arrayWorkerSchedules[i].users
                },
                month: new Date(formatToTimeZoneDate(arrayWorkerSchedules[i].month))
            });
        for (let j = 0; j < listWorkerSchedules.length; j++) {
            const command = await ManufacturingCommand(connect(DB_CONNECTION, portal))
                .findOne({
                    code: arrayWorkerSchedules[i].commandCode
                });
            listWorkerSchedules[j].turns[arrayWorkerSchedules[i].index1][arrayWorkerSchedules[i].index2] = command._id;
            await listWorkerSchedules[j].markModified("turns");
            await listWorkerSchedules[j].save();
        }
    }
    return null;
}


function getStartMonthEndMonthFromDate(startDate, endDate) {
    const moment = require('moment');
    var startMonth = moment(startDate).startOf('month');
    var endMonth = moment(endDate).endOf('month');
    return [startMonth, endMonth];
}

exports.deleteCommandFromSchedule = async (command, portal) => {
    // Tìm ra khoảng tháng
    let arrayMonth = getStartMonthEndMonthFromDate(command.startDate, command.endDate);
    // Tìm ra các lịch thỏa mãn
    const workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
        month: {
            '$gte': arrayMonth[0],
            '$lte': arrayMonth[1]
        },
        $or: [{
            manufacturingMill: command.manufacturingMill
        }, {
            user: {
                $in: command.responsibles
            }
        }]
    });

    for (let i = 0; i < workSchedules.length; i++) {
        for (let j = 0; j < workSchedules[i].turns.length; j++) {
            for (let k = 0; k < workSchedules[i].turns[j].length; k++) {
                if (command._id.equals(workSchedules[i].turns[j][k])) {
                    workSchedules[i].turns[j][k] = null;
                    await workSchedules[i].markModified("turns");
                    await workSchedules[i].save();
                }
            }
        }
    }
    // Xóa các lệnh khỏi lịch sản xuất
}
