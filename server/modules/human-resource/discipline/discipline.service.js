const {
    Discipline,
    Employee
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);

/**
 * Lấy tổng số thông tin khen thường theo đơn vị (phòng ban) và tháng 
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị tìm kiếm
 * @month : Tháng tìm kiếm
 */
exports.getTotalDiscipline = async (portal, company, organizationalUnits, month) => {
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
    };

    // Bắt sựu kiện tháng tìm kiếm khác "", undefined
    let totalListOfYear = 0;
    if (month && month.length !== 0) {
        let date = new Date(month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await Discipline(connect(DB_CONNECTION, portal)).countDocuments({
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
        totalListOfYear = await Discipline(connect(DB_CONNECTION, portal)).countDocuments({
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

    let totalList = await Discipline(connect(DB_CONNECTION, portal)).find(keySearch).populate({
        path: 'employee',
        select: 'fullName employeeNumber'
    });
    return {
        totalList,
        totalListOfYear
    };
}


/**
 * Lấy danh sách kỷ luật của nhân viên
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchDisciplines = async (portal, params, company) => {
    let keySearch = {
        company: company
    };

    if (params.endDate && params.startDate) {
        let endMonth = new Date(params.endDate).getMonth();
        let endYear = new Date(params.endDate).getFullYear();
        endMonth = endMonth + 1;
        let arrMonth = [];
        for (let i = 0;; i++) {
            let month = endMonth - i;
            if (month > 0) {
                if (month.toString().length === 1) {
                    month = `${endYear}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${params.startDate}-01` === month) {
                    break;
                }
            } else {
                let j = 1;
                for (j;; j++) {
                    month = month + 12;
                    if (month > 0) {
                        break;
                    }
                }
                if (month.toString().length === 1) {
                    month = `${endYear - j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear - j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${params.startDate}-01` === month) {
                    break;
                }
            }
        }

        let querys = [];
        arrMonth.forEach(x => {
            let date = new Date(x);
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            querys = [...querys, {
                startDate: {
                    "$gt": firstDay,
                    "$lte": lastDay
                }
            }]
        })
        keySearch = {
            ...keySearch,
            "$or": querys
        }
    }

    // Bắt sựu kiện MSNV hoặc tên nhân viên tìm kiếm khác undefined
    if (params.employeeNumber || params.employeeName) {
        let keySearchEmployee = {
            company: company
        };
        if (params.employeeNumber) {
            keySearchEmployee = {
                ...keySearchEmployee,
                employeeNumber: {
                    $regex: params.employeeNumber,
                    $options: "i"
                }
            }
        };
        if (params.employeeName) {
            keySearchEmployee = {
                ...keySearchEmployee,
                fullName: {
                    $regex: params.employeeName,
                    $options: "i"
                }
            }
        };

        let employee = await Employee(connect(DB_CONNECTION, portal)).find(keySearchEmployee, {
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

    // Lấy danh sách kỷ luật
    let listDisciplines = await Discipline(connect(DB_CONNECTION, portal)).find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        })
        .sort({
            'createdAt': 'desc'
        }).skip(params.page).limit(params.limit);
    let totalList = await Discipline(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listDisciplines
    }
}


/**
 * Thêm mới kỷ luật
 * @data : Dữ liệu kỷ luật cần tạo
 * @company : Id công ty người tạo
 */
exports.createDiscipline = async (portal, data, company) => {
    let isDiscipline = await Discipline(connect(DB_CONNECTION, portal)).findOne({
        employee: data.employee,
        company: company,
        decisionNumber: data.decisionNumber
    }, {
        field1: 1
    });

    if (isDiscipline !== null) {
        return "have_exist"
    } else {
        // Thêm kỷ luật vào database
        let createDiscipline = await Discipline(connect(DB_CONNECTION, portal)).create({
            employee: data.employee,
            company: company,
            decisionNumber: data.decisionNumber,
            organizationalUnit: data.organizationalUnit,
            startDate: data.startDate,
            endDate: data.endDate ? data.endDate : null,
            type: data.type,
            reason: data.reason,
        });

        // Lấy thông tin kỷ luật vừa tạo
        return await Discipline(connect(DB_CONNECTION, portal)).findOne({
            _id: createDiscipline._id
        }).populate([{
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        }]);
    }
}

/**
 *  Xoá thông tin kỷ luật
 * @id : Id kỷ luật cần xoá
 */
exports.deleteDiscipline = async (portal, id) => {
    return await Discipline(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin kỷ luật
 * @id : Id kỷ luật cần chỉnh sửa
 * @data : Dữ liệu chỉnh sửa kỷ luật
 * @company : Id công ty người chỉnh sửa
 */
exports.updateDiscipline = async (portal, id, data) => {
    let discipline = await Discipline(connect(DB_CONNECTION, portal)).findById(id);

    discipline.organizationalUnit = data.organizationalUnit;
    discipline.startDate = data.startDate;
    discipline.endDate = data.endDate ? data.endDate : null;
    discipline.type = data.type;
    discipline.reason = data.reason;
    await discipline.save();

    return await Discipline(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}