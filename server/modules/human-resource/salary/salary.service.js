const UserService = require('../../super-admin/user/user.service');
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
    let keySearch = {
        company: company
    };

    // Bắt sựu kiện MSNV tìm kiếm khác undefined
    if (params.employeeNumber) {
        let employee = await Employee.find({
            employeeNumber: {
                $regex: params.employeeNumber,
                $options: "i"
            }
        }, {
            _id: 1
        });
        if (employee.length !== 0) {
            employee = employee.map(x => x._id);
            keySearch = {
                ...keySearch,
                employee: {
                    $in: employee
                }
            };
        } else {
            return {
                totalList: 0,
                listSalarys: [],
            }
        }
    }

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnits) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: params.organizationalUnits
            }
        };
    }

    // Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month && params.month.length !== 0) {
        keySearch = {
            ...keySearch,
            month: new Date(params.month)
        }
    };

    // Lấy danh sách bảng lương
    let listSalarys = await Salary.find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber birthdate gender status'
        })
        .sort({
            'createAt': 'desc'
        }).skip(params.page).limit(params.limit);

    let totalList = await Salary.countDocuments(keySearch);

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
    let month = new Date(data.month);
    let isSalary = await Salary.findOne({
        company: company,
        employee: data.employee,
        organizationalUnit: data.organizationalUnit,
        month: month
    }, {
        field1: 1
    });

    if (isSalary !== null) {
        return "have_exist"
    } else {
        let createSalary = await Salary.create({
            company: company,
            employee: data.employee,
            organizationalUnit: data.organizationalUnit,
            month: month,
            mainSalary: data.mainSalary,
            unit: data.unit,
            bonus: data.bonus
        });

        // Lấy thông tin bảng lương vừa tạo
        return await Salary.findOne({
            _id: createSalary._id
        }).populate([{
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber birthdate gender status'
        }])
    }
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
exports.updateSalary = async (id, data) => {
    let salaryChange = {
        mainSalary: data.mainSalary,
        unit: data.unit,
        bonus: data.bonus,
    };
    await Salary.findOneAndUpdate({
        _id: id
    }, {
        $set: salaryChange
    });

    // Lấy thông tin bảng lương vừa cập nhật
    return await Salary.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber birthdate gender status'
    }])
}

/**
 * import dữ liệu bảng lương 
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importSalaries = async (data, company) => {
    let salaryExisted = await Salary.find({
        company: company,
        month: data[0].month,
        organizationalUnit: data[0].organizationalUnit,
    });

    let users = await UserService.getAllEmployeeOfUnitByIds([data[0].organizationalUnit]);
    users = users.map(x => x.userId.email);
    let employeeInfo = await Employee.find({
        company: company,
        emailInCompany: {
            $in: users
        }
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