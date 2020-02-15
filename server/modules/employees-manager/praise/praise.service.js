const Praise = require('../../../models/praise.model');
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
    var allPraise = await Praise.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({ 'createDate': 'desc' })
        .skip(data.page)
        .limit(data.limit);
    return allPraise;

}

// thêm mới kỷ luật
exports.create = async (data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var newPraise=await Praise.create({
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    });
    var content = {
        _id: newPraise._id,
        employee: employeeinfo,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
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
    return await Praise.findOneAndDelete({
        employee: employeeinfo._id,
        number: number
    });
}

// Update thông tin kỷ luật
exports.update = async (employeeNumber, number, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var praiseChange = {
        employee: employeeinfo._id,
        number: number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    };
    var praise = await Praise.findOneAndUpdate({
        employee: employeeinfo._id,
        number: number
    }, {
        $set: praiseChange
    });
    var updatePraise = {
        _id: praise._id,
        employee: employeeinfo,
        number: number,
        unit: data.unit,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        reason: data.reason,
    }
    return updatePraise;
}