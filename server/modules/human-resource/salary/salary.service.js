const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    Salary
} = require('../../../models').schema;

/**
 * Lấy danh sách các bảng lương của nhân viên
 * @params : Dữ liệu các key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchSalaries = async (params, company) => {
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

    // Lấy danh sách bảng lương
    var totalList = await Salary.count(keySearch);
    var listSalarys = await Salary.find(keySearch).populate({
        path: 'employee',
        model: Employee
    })
        .sort({
            'createDate': 'desc'
        }).skip(params.page).limit(params.limit);

    for (let n in listSalarys) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listSalarys[n].employee.emailInCompany);
        listSalarys[n] = {
            ...listSalarys[n]._doc,
            ...value
        }
    }

    return {
        totalList,
        listSalarys
    }
}

/**
 *  Thêm mới bảng lương mới 
 *  @data : Dữ liệu bảng lương
 *  @company : Id công ty
 */
exports.createSalary = async (data, company) => {
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
        let isSalary = await Salary.findOne({
            employee: employeeInfo._id,
            company: company,
            month: month
        }, {
            field1: 1
        });
        if (isSalary !== null) {
            return "have_exist"
        } else {
            // Thêm bảng lương vào database
            let createSalary = await Salary.create({
                employee: employeeInfo._id,
                company: company,
                month: month,
                mainSalary: data.mainSalary,
                unit: data.unit,
                bonus: data.bonus
            });
            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
            // Lấy thông tin bảng lương vừa tạo
            let newSalary = await Salary.findOne({
                _id: createSalary._id
            }).populate([{
                path: 'employee',
                model: Employee
            }])
            return {
                ...newSalary._doc,
                ...value
            }
        }

    } else return null
}

/**
 * Xoá bẳng lương
 * @id : Id bảng lương
 */
exports.deleteSalary = async (id) => {
    return await Salary.findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin bảng lương
 * @id : Id bảng lương muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 * @company : Id công ty
 */
exports.updateSalary = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    }, {
        _id: 1,
        emailInCompany: 1
    });
    if (employeeInfo !== null) {
        let salaryChange = {
            mainSalary: data.mainSalary,
            unit: data.unit,
            bonus: data.bonus,
        };
        // Cập nhật thông tin bảng lương vào database
        await Salary.findOneAndUpdate({
            _id: id
        }, {
            $set: salaryChange
        });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);

        // Lấy thông tin bảng lương vừa cập nhật
        var updateSalary = await Salary.findOne({
            _id: id
        }).populate([{
            path: 'employee',
            model: Employee
        }])

        return {
            ...updateSalary._doc,
            ...value
        }

    } else return null
}



// formatDate = (date) => {
//     var d = new Date(date),
//         month = (d.getMonth() + 1),
//         //day = d.getDate(),
//         year = d.getFullYear();
//         console.log("====",d);
//     if (month.length < 2)
//         month = '0' + month;
//     if (day.length < 2)
//         day = '0' + day;
//     return [year,month].join('-');
// }

/**
 * import dữ liệu bảng lương 
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importSalaries = async (data, company) => {
    let salaryExisted = await Salary.find({
        month: data[0].month,
        company: company
    });
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
            if (salaryExisted.length !== 0) {
                let monthSalary = new Date(x.month);
                let salary = salaryExisted.filter(y => y.employee.toString() === employee[0]._id.toString() && monthSalary.toString() === y.month.toString());
                if (salary.length !== 0) {
                    x = {
                        ...x,
                        errorAlert: [...x.errorAlert, "month_salary_have_exist"],
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
        return await Salary.insertMany(data);
    }
}