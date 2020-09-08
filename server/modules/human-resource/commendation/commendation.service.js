const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    Commendation
} = require('../../../models').schema;

/**
 * Lấy tổng số thông tin khen thường theo đơn vị (phòng ban) và tháng 
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị tìm kiếm
 * @month : Tháng tìm kiếm
 */
exports.getTotalCommendation = async (company, organizationalUnits, month) => {
    let keySearch = {
        company: company
    };

    // Bắt sựu kiện tìm kiếm theo đơn vị 
    if (organizationalUnits !== undefined) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnits
            }
        }
    }

    // Bắt sựu kiện tháng tìm kiếm khác "", undefined
    let totalListOfYear = 0;
    if (month !== undefined && month.length !== 0) {
        let date = new Date(month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await Commendation.count({
            ...keySearch,
            startDate: {
                "$gt": firstDayOfYear,
                "$lte": lastDayOfYear
            }
        });
        keySearch = {
            ...keySearch,
            startDate: {
                "$gt": firstDay,
                "$lte": lastDay
            }
        }
    } else {
        let date = new Date();
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await Commendation.count({
            ...keySearch,
            startDate: {
                "$gt": firstDayOfYear,
                "$lte": lastDayOfYear
            }
        });
        keySearch = {
            ...keySearch,
            startDate: {
                "$gt": firstDayOfYear,
                "$lte": lastDayOfYear
            }
        }
    }
    let totalList = await Commendation.count(keySearch);
    return {
        totalList,
        totalListOfYear
    };
}


/**
 * Lấy danh sách khen thưởng của nhân viên
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchCommendations = async (params, company) => {
    let keySearch = {
        company: company
    };

    // Bắt sựu kiện tìm kiếm them MSNV
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

    // Bắt sựu kiện tìm kiếm theo cấp ra quyết định
    if (params.organizationalUnits && params.organizationalUnits.length !== 0) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: params.organizationalUnits
            }
        };
    }

    // Bắt sựu kiện tìm kiếm theo số quyết định
    if (params.decisionNumber) {
        keySearch = {
            ...keySearch,
            decisionNumber: {
                $regex: params.decisionNumber,
                $options: "i"
            }
        }
    };

    // Bắt sựu kiện tìm kiếm theo hình thức khen thưởng
    if (params.type) {
        keySearch = {
            ...keySearch,
            type: {
                $regex: params.type,
                $options: "i"
            }
        }
    };

    // Lấy danh sách khen thưởng
    let listCommendations = await Commendation.find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        })
        .sort({
            'createAt': 'desc'
        }).skip(params.page).limit(params.limit);
    let totalList = await Commendation.countDocuments(keySearch);

    return {
        totalList,
        listCommendations
    }
}

/**
 * Thêm mới khen thưởng
 * @data : dữ liệu khen thưởng cần thêm
 * @company : Id công ty người thêm
 */
exports.createCommendation = async (data, company) => {
    console.log(data);


    let isCommendation = await Commendation.findOne({
        employee: data.employee,
        company: company,
        decisionNumber: data.decisionNumber
    }, {
        field1: 1
    });

    if (isCommendation !== null) {
        return "have_exist"
    } else {
        // Thêm khen thưởng vào database
        let createCommendation = await Commendation.create({
            employee: data.employee,
            company: company,
            decisionNumber: data.decisionNumber,
            organizationalUnit: data.organizationalUnit,
            startDate: data.startDate,
            type: data.type,
            reason: data.reason,
        });

        // Lấy thông tin khen thưởng vừa tạo
        return await Commendation.findOne({
            _id: createCommendation._id
        }).populate([{
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        }])
    }
}

/**
 * Xoá thông tin khen thưởng
 * @id : Id khen thưởng cần xoá
 */
exports.deleteCommendation = async (id) => {
    return await Commendation.findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin khen thưởng
 * @id : Id khen thương cần chỉnh sửa
 * @data : Dữ liệu chỉnh sửa khen thưởng
 * @company : Id công ty người thực hiện thay đổi
 */
exports.updateCommendation = async (id, data) => {
    let commendation = await Commendation.findById(id);

    commendation.organizationalUnit = data.organizationalUnit;
    commendation.startDate = data.startDate;
    commendation.type = data.type;
    commendation.reason = data.reason;
    await commendation.save();

    return await Commendation.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}