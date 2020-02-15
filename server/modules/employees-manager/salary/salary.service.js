const Salary = require('../../../models/salary.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách các bẳng lương của nhân viên
exports.get = async (data) => {
    var keySearch = {};
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
        }).sort({ 'createDate': 'desc' })
        .skip(data.page)
        .limit(data.limit);
    return allSalary;

}

// thêm mới bẳng lương mới
exports.create = async (data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var salary =data.mainSalary+data.unit;
    //console.log(employeeinfo.map(x=x._id));
    var newSalary = await Salary.create({
        employee: employeeinfo._id,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
    });
    var content = {
        _id:newSalary._id,
        employee: employeeinfo,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
    }
    return content
}

// Xoá bẳng lương
exports.delete = async (employeeNumber, month) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });

    return await Salary.findOneAndDelete({
        employee: employeeinfo._id,
        month: month
    });
}

// Update thông tin bảng lương
exports.update = async (employeeNumber, month, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var salaryChange = {
        employee: employeeinfo._id,
        month: month,
        mainSalary: data.mainSalary+data.unit,
        bonus: data.bonus
    };
    var salaryInfo=await Salary.findOneAndUpdate({
        employee: employeeinfo._id,
        month: month
    }, {
        $set: salaryChange
    });
    var updateSalary = {
        _id:salaryInfo._id,
        employee: employeeinfo,
        month: month,
        mainSalary: data.mainSalary+data.unit,
        bonus: data.bonus
    }
    return updateSalary;
}