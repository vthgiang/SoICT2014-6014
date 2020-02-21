const Salary = require('../../../models/salary.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách các bẳng lương của nhân viên
exports.get = async (data,company) => {
    var keySearch = {
        company:company
    };
    if (data.employeeNumber !== "") {
        var employeeinfo = await Employee.findOne({
            employeeNumber: data.employeeNumber
        });
        keySearch = {
            ...keySearch,
            employee: employeeinfo._id
        }
    };
    if (data.month !== "") {
        keySearch = {
            ...keySearch,
            month: data.month
        }
    };
    var allSalary = await Salary.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    return allSalary;

}

// thêm mới bẳng lương mới
exports.create = async (data,company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company:company
    });
    var salary = data.mainSalary + data.unit;
    //console.log(employeeinfo.map(x=x._id));
    var newSalary = await Salary.create({
        employee: employeeinfo._id,
        company:company,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
    });
    var content = {
        _id: newSalary._id,
        employee: employeeinfo,
        company:company,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
    }
    return content
}

// Xoá bẳng lương
exports.delete = async (id) => {
    return await Salary.findOneAndDelete({
        _id: id
    });
}

// Update thông tin bảng lương
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var salaryChange = {
        employee: employeeinfo._id,
        month: data.month,
        mainSalary: data.mainSalary + data.unit,
        bonus: data.bonus
    };
    await Salary.findOneAndUpdate({
        _id: id
    }, {
        $set: salaryChange
    });
    var updateSalary = {
        _id: id,
        employee: employeeinfo,
        month: data.month,
        mainSalary: data.mainSalary + data.unit,
        bonus: data.bonus
    }
    return updateSalary;
}