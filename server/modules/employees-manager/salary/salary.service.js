const Salary = require('../../../models/salary.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách các bẳng lương của nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company,
    };
    if (data.month !== "") {
        keySearch = {
            ...keySearch,
            month: data.month
        }
    };
    if (data.employeeNumber !== "") {
        var employeeinfo = await Employee.find({
            employeeNumber: {
                $regex: data.employeeNumber,
                $options: "i"
            }
        });
        if (employeeinfo.length !== 0) {
            keySearch = {
                ...keySearch,
                $or: []
            }
            for (let x in employeeinfo) {
                keySearch = {
                    ...keySearch,
                    $or: [...keySearch.$or, {
                        employee: employeeinfo[x]._id
                    }]
                }
            }
        }
    }
    var totalList = await Salary.count(keySearch);


    
    var listSalary = await Salary.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);

    var content = {
        totalList,
        listSalary
    }
    return content;

}

// thêm mới bẳng lương mới
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var salary = data.mainSalary + data.unit;
    //console.log(employeeinfo.map(x=x._id));
    var newSalary = await Salary.create({
        employee: employeeinfo._id,
        company: company,
        month: data.month,
        mainSalary: salary,
        bonus: data.bonus
    });
    var content = {
        _id: newSalary._id,
        employee: employeeinfo,
        company: company,
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
        mainSalary: data.unit ? (data.mainSalary + data.unit) : data.mainSalary,
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