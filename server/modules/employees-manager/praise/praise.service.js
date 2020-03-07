const Praise = require('../../../models/praise.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách khen thưởng của nhân viên
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
    var totalList = await Praise.count(keySearch);
    var listPraise = await Praise.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    var content = {
        totalList,
        listPraise
    }
    return content;

}

// thêm mới khen thưởng
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var newPraise = await Praise.create({
        employee: employeeinfo._id,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    });
    var content = {
        _id: newPraise._id,
        employee: employeeinfo,
        company: company,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    }
    return content
}

// Xoá thông tin khen thưởng
exports.delete = async (id) => {
    return await Praise.findOneAndDelete({
        _id: id
    });
}

// Update thông tin khen thưởng
exports.update = async (id, data) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber
    });
    var praiseChange = {
        employee: employeeinfo._id,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    };
    await Praise.findOneAndUpdate({
        _id: id
    }, {
        $set: praiseChange
    });
    var updatePraise = {
        _id: id,
        employee: employeeinfo,
        number: data.number,
        unit: data.unit,
        startDate: data.startDate,
        type: data.type,
        reason: data.reason,
    }
    return updatePraise;
}