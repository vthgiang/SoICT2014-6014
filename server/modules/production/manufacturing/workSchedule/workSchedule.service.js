const { split, isElement } = require("lodash");
const mongoose = require("mongoose");
const { getAllEmployeeOfUnitByRole } = require("../../../super-admin/user/user.service");

const {
    WorkSchedule, ManufacturingMill, ManufacturingWorks, ManufacturingCommand, OrganizationalUnit
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

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
            console.log(listWorksIds);
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
                    for (k = 0; k < workSchedules.docs[i].turns[j].length; k++) {
                        if (workSchedules.docs[i].turns[j][k] != null) {
                            let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(workSchedules.docs[i].turns[j][k])
                                .populate([{
                                    path: "good.good",
                                    select: "code name"
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
                                    path: "good.good",
                                    select: "code name"
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
    return { workSchedules }
}