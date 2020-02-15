const Discipline = require('../../../models/discipline.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách kỷ luật của nhân viên
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
    if (data.number !== "") {
        keySearch = {
            ...keySearch,
            number: data.number
        }
    };
    var allDiscipline = await Discipline.find(keySearch).populate({
            path: 'employee',
            model: Employee
        })
        .skip(data.page)
        .limit(data.limit);
    return allDiscipline;

}

// thêm mới kỷ luật
exports.create = async (data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var newDiscipline = await Discipline.create({
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    });
    var content = {
        _id : newDiscipline._id,
        employee: employeeinfo,
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
exports.delete = async (employeeNumber, number) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    return await Discipline.findOneAndDelete({
        employee: employeeinfo._id,
        number: number
    });
}

// Update thông tin kỷ luật
exports.update = async (employeeNumber, number, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var DisciplineChange = {
        employee: employeeinfo._id,
        number: number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    };
    var disciplineInfo = await Discipline.findOneAndUpdate({
        employee: employeeinfo._id,
        number: number
    }, {
        $set: DisciplineChange
    });
    var updateDiscipline = {
        _id: disciplineInfo._id,
        employee: employeeinfo,
        number: number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    }
    return updateDiscipline;
}