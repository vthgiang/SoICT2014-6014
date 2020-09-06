const EmployeeService = require('../profile/profile.service');
const {
    Employee,
    AnnualLeave
} = require('../../../models').schema;

/**
 * Lấy số lượng ngày nghỉ phép của nhân viên trong năm hiện tại
 * @param {*} email : email công ty nhân viên
 * @param {*} company : Id công ty
 */
exports.getNumberAnnaulLeave = async (email, company) => {
    let employee = await Employee.findOne({
        company: company,
        emailInCompany: email
    }, {
        _id: 1
    });
    if (employee) {
        let year = new Date().getFullYear();
        let firstDay = new Date(year, 0, 1);
        let lastDay = new Date(Number(year) + 1, 0, 1);
        let annulLeaves = await AnnualLeave.find({
            company: company,
            employee: employee._id,
            status: 'pass',
            startDate: {
                "$gt": firstDay,
                "$lte": lastDay
            }
        });
        let total = 0;
        annulLeaves.forEach(x => {
            total = total + Math.round((new Date(x.endDate).getTime() - new Date(x.startDate).getTime()) / (21 * 60 * 60 * 1000)) + 1;
        })
        return {
            numberAnnulLeave: total
        }
    }
    return {
        numberAnnulLeave: 0
    }
}

/**
 * Lấy tổng số thông tin nghỉ phép theo đơn vị (phòng ban) và tháng 
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị tìm kiếm
 * @month : Tháng tìm kiếm
 */
exports.getTotalAnnualLeave = async (company, organizationalUnits, month) => {
    let keySearchEmployee, keySearch = {
        company: company
    };

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (organizationalUnits !== undefined) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(organizationalUnits, undefined);
        keySearchEmployee = {
            ...keySearchEmployee,
            emailInCompany: {
                $in: emailInCompany
            }
        }
    }
    if (keySearchEmployee !== undefined) {
        let employeeinfo = await Employee.find(keySearchEmployee);
        let employee = employeeinfo.map(employeeinfo => employeeinfo._id);
        keySearch = {
            ...keySearch,
            employee: {
                $in: employee
            }
        }
    }

    let totalListOfYear = 0;
    // Bắt sựu kiện tháng tìm kiếm khác "", undefined
    if (month !== undefined && month.length !== 0) {
        let date = new Date(month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await AnnualLeave.count({
            ...keySearch,
            startDate: {
                "$gt": firstDayOfYear,
                "$lte": lastDayOfYear
            }
        });
        keySearch = {
            ...keySearch,
            "$or": [{
                startDate: {
                    "$gt": firstDay,
                    "$lte": lastDay
                }
            }, {
                endDate: {
                    "$gt": firstDay,
                    "$lte": lastDay
                }
            }]
        }
    } else {
        let date = new Date();
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await AnnualLeave.count({
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
    };

    let totalList = await AnnualLeave.count(keySearch);
    return {
        totalList,
        totalListOfYear
    };
}

/**
 * Lấy thông tin nghỉ phép trong 6 hoặc 12 tháng gần nhất theo đơn vị
 * @param {*} organizationalUnits: array id đơn vị
 * @param {*} numberMonth : Số tháng cần lấy thông tin nghỉ phép (6 hoặc 12)
 * @param {*} company : Id công ty
 */
exports.getAnnualLeaveOfNumberMonth = async (organizationalUnits, numberMonth, company) => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    currentMonth = currentMonth + 1;
    let arrMonth = [];
    for (let i = 0; i < Number(numberMonth); i++) {
        let month = currentMonth - i;
        if (month > 0) {
            if (month.toString().length === 1) {
                month = `${currentYear}-0${month}-01`;
                arrMonth = [...arrMonth, month];
            } else {
                month = `${currentYear}-${month}-01`;
                arrMonth = [...arrMonth, month];
            }
        } else {
            month = month + 12;
            if (month.toString().length === 1) {
                month = `${currentYear-1}-0${month}-01`;
                arrMonth = [...arrMonth, month];
            } else {
                month = `${currentYear-1}-${month}-01`;
                arrMonth = [...arrMonth, month];
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

    if (organizationalUnits) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(organizationalUnits, undefined);
        let arrId = await Employee.find({
            company: company,
            emailInCompany: {
                $in: emailInCompany
            }
        }, {
            _id: 1
        })
        arrId = arrId.map(x => x._id);
        let listAnnualLeaveOfNumberMonth = await AnnualLeave.find({
            company: company,
            status: 'pass',
            employee: {
                $in: arrId
            },
            "$or": querys
        }, {
            startDate: 1,
            endDate: 1
        })

        return {
            listAnnualLeaveOfNumberMonth,
            arrMonth
        }
    } else {
        let listAnnualLeaveOfNumberMonth = await AnnualLeave.find({
            company: company,
            status: 'pass',
            "$or": querys
        }, {
            startDate: 1,
            endDate: 1
        })

        return {
            listAnnualLeaveOfNumberMonth,
            arrMonth
        }
    }
}



/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchAnnualLeaves = async (params, company) => {
    let keySearch = {
        company: company
    };

    // Bắt sựu kiện tìm kiếm theo MSNV
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

    // Bắt sựu kiện tìm kiếm theo đơn vị
    if (params.organizationalUnits) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: params.organizationalUnits
            }
        };
    }

    // Bắt sựu kiện tìm kiếm theo trạng thái
    if (params.status !== undefined) {
        keySearch = {
            ...keySearch,
            status: {
                $in: params.status
            }
        }
    };

    // Bắt sựu kiện tìm kiếm theo tháng 
    if (params.month !== undefined && params.month.length !== 0) {
        let date = new Date(params.month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        keySearch = {
            ...keySearch,
            "$or": [{
                startDate: {
                    "$gt": firstDay,
                    "$lte": lastDay
                }
            }, {
                endDate: {
                    "$gt": firstDay,
                    "$lte": lastDay
                }
            }]
        }
    };
    let listAnnualLeaves = await AnnualLeave.find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        })
        .sort({
            'createdAt': 'desc'
        }).skip(params.page).limit(params.limit);
    let totalList = listAnnualLeaves.length;

    return {
        totalList,
        listAnnualLeaves
    }
}

/**
 * Thêm mới thông tin nghỉ phép
 * @data : dữ liệu nghỉ phép mới
 * @company : id công ty người tạo
 */
exports.createAnnualLeave = async (data, company) => {
    // Tạo mới thông tin nghỉ phép vào database
    let createAnnualLeave = await AnnualLeave.create({
        employee: data.employee,
        company: company,
        organizationalUnit: data.organizationalUnit,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        reason: data.reason,
    });

    return await AnnualLeave.findOne({
        _id: createAnnualLeave._id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }])
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép muốn xoá
 */
exports.deleteAnnualLeave = async (id) => {
    return await AnnualLeave.findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateAnnualLeave = async (id, data) => {
    let annualLeave = await AnnualLeave.findById(id);

    annualLeave.startDate = data.startDate;
    annualLeave.status = data.status;
    annualLeave.endDate = data.endDate;
    annualLeave.reason = data.reason;
    await annualLeave.save();

    return await AnnualLeave.findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}