const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    Timesheet
} = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy thông tin chấm công nhân viên
 * @params : Dữ liệu các key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchTimesheets = async (portal, params, company) => {
    let keySearchEmployee, keySearch = {
        company: company
    };

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnit) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(portal, params.organizationalUnit, undefined);
        keySearchEmployee = {
            ...keySearchEmployee,
            emailInCompany: {
                $in: emailInCompany
            }
        }
    }

    // Bắt sựu kiện MSNV tìm kiếm khác undefined
    if (params.employeeNumber) {
        keySearchEmployee = {
            ...keySearchEmployee,
            employeeNumber: {
                $regex: params.employeeNumber,
                $options: "i"
            }
        }
    }
    if (keySearchEmployee) {
        var employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(keySearchEmployee);
        var employee = employeeInfo.map(x => x._id);
        keySearch = {
            ...keySearch,
            employee: {
                $in: employee
            }
        }
    }

    // Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month) {
        keySearch = {
            ...keySearch,
            month: new Date(params.month)
        }
    };

    // Lấy danh sách chấm công
    let totalList = await Timesheet(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let listTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).find(keySearch).populate({
            path: 'employee',
            select: 'employeeNumber fullName'
        })
        .sort({
            'createAt': 'desc'
        }).skip(params.page).limit(params.limit);

    return {
        totalList,
        listTimesheets
    }
}

/**
 * Tạo mới thông tin chấm công
 * @param {*} data : Dữ liệu chấm công
 * @param {*} company : Id công ty
 */
exports.createTimesheets = async (portal, data, company) => {
    let month = new Date(data.month);
    let isSalary = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
        employee: data.employee,
        company: company,
        month: month
    }, {
        field1: 1
    });
    if (isSalary !== null) {
        return "have_exist"
    } else {
        // Thêm thông tin chấm công
        let createTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).create({
            employee: data.employee,
            company: company,
            month: month,
            shift1: data.shift1,
            shift2: data.shift2,
            shift3: data.shift3,
        });
        // Lấy thông tin chấm công vừa cập nhật
        let newTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
            _id: createTimesheets._id
        }).populate([{
            path: 'employee',
            select: 'employeeNumber fullName'
        }])

        return newTimesheets
    }
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công
 */
exports.deleteTimesheets = async (portal, id) => {
    return await Timesheet(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin chấm công
 * @id : id thông tin chấm công muốn chỉnh sửa
 * @data : Dữ liệu thay đổi thông tin chấm công
 */
exports.updateTimesheets = async (portal, id, data) => {
    // Cập nhật thông tin chấm công
    let infoTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findById(id);
    infoTimesheets.shift1 = data.shift1;
    infoTimesheets.shift2 = data.shift2;
    infoTimesheets.shift3 = data.shift3;
    await infoTimesheets.save();

    // Lấy thông tin chấm công vừa cập nhật
    let updateTimesheets = await Timesheet(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'employeeNumber fullName'
    }])

    return updateTimesheets
}

/**
 * import thông tin chấm công
 */
exports.importTimesheets = async (portal, data, company) => {
    let timesheetsExisted = await Timesheet(connect(DB_CONNECTION, portal)).find({
        month: data[0].month,
        company: company
    })
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find({
        company: company
    }, {
        employeeNumber: 1,
        _id: 1
    });
    let rowError = [];
    data = data.map((x, index) => {
        let employee = employeeInfo.filter(y => y.employeeNumber === x.employeeNumber);
        if (employee.length === 0) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "staff_code_not_find"],
                error: true
            };
            rowError = [...rowError, index + 1];
        } else {
            x = {
                ...x,
                employee: employee[0]._id,
                company: company
            };
            if (timesheetsExisted.length !== 0) {
                let timesheetsMonth = new Date(x.month);
                let timesheets = timesheetsExisted.filter(y => y.employee.toString() === employee[0]._id.toString() && timesheetsMonth.toString() === y.month.toString());
                if (timesheets.length !== 0) {
                    x = {
                        ...x,
                        errorAlert: [...x.errorAlert, "month_timesheets_have_exist"],
                        error: true
                    };
                    rowError = [...rowError, index + 1];
                }
            }
        }
        return x;
    })
    if (rowError.length !== 0) {
        return {
            data,
            rowError
        }
    } else {
        return await Timesheet(connect(DB_CONNECTION, portal)).insertMany(data);
    }
}