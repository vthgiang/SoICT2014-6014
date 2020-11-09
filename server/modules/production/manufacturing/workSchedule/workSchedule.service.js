const { split } = require("lodash");

const {
    WorkSchedule, ManufacturingMill, Employee, ManufacturingWorks
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

// Hàm lấy ra tổng số ngày trong tháng
function getAllDayOfMonth(month) {
    let arrayYearMonth = split(month, "-");
    let lastDayOfMonth = new Date(arrayYearMonth[0], arrayYearMonth[1], 0);
    return lastDayOfMonth.getDate();
}

// Hàm lấy ra tất cả các nhân viên trong 1 nhà máy có vai trò là employee

async function getAllEmployeeOfManufacturingWorks(arrayWorks, code, portal) {
    // tra ve mang id cac employee thoa man
    let employees = [];
    let manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        _id: {
            $in: arrayWorks
        }
    }).populate([{
        path: "organizationalUnit"
    }]);
    console.log(manufacturingWorks);

}




// Hàm tạo một lịch trong tháng ứng với manufacturingMill hoặc employee
exports.createWorkSchedule = async (data, portal) => {
    if (!data.month || !data.numberOfTurns) {
        throw Error("data is not defined")
    }
    if (!data.manufacturingMill && !data.employee && !data.allManufacturingMill && !data.allEmployee) {
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
    if (data.employee) {
        checkWorkSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
            employee: data.employee,
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
            console.log("vao day");
            // Lấy ra tất cả lịch của các xưởng trong tháng truyền vào
            let manufacturingMillSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find({
                manufacturingMill: {
                    $ne: null
                },
                month: month
            });
            let arrayMillId = manufacturingMillSchedules.map(x => x.manufacturingMill);
            // Lấy ra các xưởng đang hoạt động chưa được sếp lịch trong tháng truyền vào
            let manufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
                _id: {
                    $nin: arrayMillId
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
        else if (data.allEmployee) {
            // let employees = await Employee(connect(DB_CONNECTION, portal)).find({});
            // let schedules = [];
            // for (let i = 0; i < employees.length; i++) {
            //     schedules.push({
            //         employee: employees[i],
            //         month: month,
            //         turns: turns
            //     });
            // }
            // workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).insertMany(schedules);

        }
        else {
            let newWorkSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).create({
                employee: data.employee,
                manufacturingMill: data.manufacturingMill,
                month: month,
                turns: turns
            });

            let workSchedule = await WorkSchedule(connect(DB_CONNECTION, portal)).findById({ _id: newWorkSchedule._id })
                .populate([{
                    path: 'manufacturingMill'
                }, {
                    path: 'employee'
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
    if (query.object !== 'manufacturingMill' && query.object !== 'employee') {
        throw Error('params object is manufacturingMill or employee');
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

        let searchMill = {
            status: 1
        };

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
                    page: page,
                    limit: limit,
                    populate: [{
                        path: 'manufacturingMill'
                    }, {
                        path: "turns.0"
                    }]
                });
            return { workSchedules }
        }

    }

    if (query.object == 'employee') {
        options.employee = {
            $ne: null
        }
        if (query.employee) {
            options.employee = query.employee
        }

        // Xử lý tìm ra mảng các employee với mảng manufacturingWorks, employeeNumber truyền vào
        // Tìm tất cả các nhân viên trong các nhà máy
        // Lọc các nhân viên đó theo code
        // Tạo mảng id để workSchedule filter

        if (!limit | !page) {
            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal)).find(options)
                .populate([{
                    path: 'employee', select: 'fullName employeeNumber emailInCompany'
                }]);

            return { workSchedules };
        } else {
            let workSchedules = await WorkSchedule(connect(DB_CONNECTION, portal))
                .paginate(options, {
                    page: page,
                    limit: limit,
                    populate: [{
                        path: 'employee', select: 'fullName employeeNumber emailInCompany'
                    }]
                });
            return { workSchedules }
        }
    }
}