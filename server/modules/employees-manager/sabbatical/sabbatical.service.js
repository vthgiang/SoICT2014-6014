const Sabbatical = require('../../../models/sabbatical.model');
const Employee = require('../../../models/employee.model');

//lấy danh sách thông tin kỷ luật
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    };
    if (data.status !== "All") {
        keySearch = {
            ...keySearch,
            status: data.status
        }
    };
    if (data.month !== "") {
        keySearch = {
            ...keySearch,
            startDate: {
                $regex: data.month,
                $options: "i"
            },
            endDate: {
                $regex: data.month,
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
    };
    var totalList = await Sabbatical.count(keySearch);
    var listSabbatical = await Sabbatical.find(keySearch).populate({
            path: 'employee',
            model: Employee
        }).sort({
            'createDate': 'desc'
        })
        .skip(data.page)
        .limit(data.limit);
    var content = {
        totalList,
        listSabbatical
    }
    return content;

}

// thêm mới thông tin nghỉ phép
exports.create = async (data, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    });
    var newSabbatical = await Sabbatical.create({
        employee: employeeinfo._id,
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    });
    var content = {
        _id: newSabbatical._id,
        employee: employeeinfo,
        company: company,
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
    await Sabbatical.findOneAndUpdate({
        _id: id,
    }, {
        $set: SabbaticalChange
    });
    var updateSabbatical = {
        _id: id,
        employee: employeeinfo,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    }
    return updateSabbatical;
}