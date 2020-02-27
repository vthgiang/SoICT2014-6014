const Discipline = require('../../../models/discipline.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách kỷ luật của nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    };
    if (data.number !== "") {
        keySearch = {
            ...keySearch,
            number: {
                $regex: data.number,
                $options: "i"
            }
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
    var totalList = await Discipline.count(keySearch);
    var listDiscipline = await Discipline.find(keySearch).populate({
            path: 'employee',
            model: Employee
        })
        .skip(data.page)
        .limit(data.limit);
    var content = {
        totalList,
        listDiscipline
    }
    return content;

}

// thêm mới kỷ luật
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var newDiscipline = await Discipline.create({
        employee: employeeinfo._id,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    });
    var content = {
        _id: newDiscipline._id,
        employee: employeeinfo,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    }
    return content
}

// Xoá thông tin kỷ luật
exports.delete = async (id) => {
    return await Discipline.findOneAndDelete({
        _id: id
    });
}

// Update thông tin kỷ luật
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var DisciplineChange = {
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    };
    await Discipline.findOneAndUpdate({
        _id: id
    }, {
        $set: DisciplineChange
    });
    var updateDiscipline = {
        _id: id,
        employee: employeeinfo,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    }
    return updateDiscipline;
}