const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    Timesheet
} = require('../../../models').schema;

/**
 * Lấy thông tin chấm công nhân viên
 * @params : Dữ liệu các key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchTimesheets = async (params, company) => {
    var keySearchEmployee, keySearch = {
        company: company
    };

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnit !== undefined) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnit, params.position);
        keySearchEmployee = {
            ...keySearchEmployee,
            emailInCompany: {
                $in: emailInCompany
            }
        }
    }

    // Bắt sựu kiện MSNV tìm kiếm khác undefined
    if (params.employeeNumber !== undefined && params.employeeNumber.length !== 0) {
        keySearchEmployee = {
            ...keySearchEmployee,
            employeeNumber: {
                $regex: params.employeeNumber,
                $options: "i"
            }
        }
    }
    if (keySearchEmployee !== undefined) {
        var employeeInfo = await Employee.find(keySearchEmployee);
        var employee = employeeInfo.map(x => x._id);
        keySearch = {
            ...keySearch,
            employee: {
                $in: employee
            }
        }
    }

    // Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month !== undefined && params.month.length !== 0) {
        keySearch = {
            ...keySearch,
            month: new Date(params.month)
        }
    };

    // Lấy danh sách chấm công
    let totalList = await Timesheet.count(keySearch);
    let listTimesheets = await Timesheet.find(keySearch).populate({
            path: 'employee',
            model: Employee,
            select: 'employeeNumber fullName'
        })
        .sort({
            'createDate': 'desc'
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
exports.createTimesheets = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    }, {
        _id: 1,
        emailInCompany: 1
    });
    let month = new Date(data.month);
    if (employeeInfo !== null) {
        let isSalary = await Timesheet.findOne({
            employee: employeeInfo._id,
            company: company,
            month: month
        }, {
            field1: 1
        });
        if (isSalary !== null) {
            return "have_exist"
        } else {
            // Thêm thông tin chấm công
            let createTimesheets = await Timesheet.create({
                employee: employeeInfo._id,
                company: company,
                month: month,
                workSession1: data.workSession1,
                workSession2: data.workSession2,
            });
            // Lấy thông tin chấm công vừa cập nhật
            let newTimesheets = await Timesheet.findOne({
                _id: createTimesheets._id
            }).populate([{
                path: 'employee',
                model: Employee,
                select: 'employeeNumber fullName'
            }])

            return newTimesheets
        }
    } else return null
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công
 */
exports.deleteTimesheets = async (id) => {
    return await Timesheet.findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin chấm công
 * @id : id thông tin chấm công muốn chỉnh sửa
 * @data : Dữ liệu thay đổi thông tin chấm công
 */
exports.updateTimesheets = async (id, data) => {
    // Cập nhật thông tin chấm công
    let infoTimesheets = await Timesheet.findById(id);
    infoTimesheets.workSession1 = data.workSession1;
    infoTimesheets.workSession2 = data.workSession2;
    await infoTimesheets.save();

    // Lấy thông tin chấm công vừa cập nhật
    let updateTimesheets = await Timesheet.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        model: Employee,
        select: 'employeeNumber fullName'
    }])

    return updateTimesheets
}

/**
 * import thông tin chấm công
 */
exports.importTimesheets = async (data, company) => {
    let timesheetsExisted = await Timesheet.find({
        month: data[0].month,
        company: company
    })
    let employeeInfo = await Employee.find({
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
        return await Timesheet.insertMany(data);
    }
}