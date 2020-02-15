const Sabbatical = require('../../../models/sabbatical.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách thông tin kỷ luật
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
    // if (data.month !== "") {
    //     keySearch = {
    //         ...keySearch,
    //         month: data.month
    //     }
    // };
    if (data.status !== "") {
        keySearch = {
            ...keySearch,
            status: data.status
        }
    };
    var allSabbatical = await Sabbatical.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    return allSabbatical;

}

// thêm mới thông tin nghỉ phép
exports.create = async (data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var newSabbatical = await Sabbatical.create({
        employee: employeeinfo._id,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    });
    var content = {
        _id: newSabbatical._id,
        employee: employeeinfo,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    }
    return content
}

// Xoá thông tin nghỉ phép
exports.delete = async (id) => {
    return await Sabbatical.findOneAndDelete({
        _id: id,
    });
}

// Cập nhật thông tin nghỉ phép
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var SabbaticalChange = {
        employee: employeeinfo._id,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    };
    var SabbaticalInfo = await Sabbatical.findOneAndUpdate({
        _id: id,
    }, {
        $set: SabbaticalChange
    });
    var updateSabbatical = {
        _id: SabbaticalInfo._id,
        employee: employeeinfo,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    }
    return updateSabbatical;
}