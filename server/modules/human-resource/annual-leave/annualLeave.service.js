const UserService = require(`../../super-admin/user/user.service`);
const {
    Employee,
    AnnualLeave
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);



exports.getAnnaulLeaveBeforAndAfterOneWeek =async (portal, organizationalUnits,company) =>{
    const dateNow = new Date();
    let firstDay = new Date();
    let lastDay = new Date();
    firstDay = new Date(firstDay.setDate(dateNow.getDate() - 6))
    lastDay = new Date(lastDay.setDate(dateNow.getDate() + 6))
    let keySearch = {
        company: company,
        "$or": [{
            startDate: {
                "$gte": firstDay,
                "$lte": lastDay
            }
        }, {
            endDate: {
                "$gte": firstDay,
                "$lte": lastDay
            }
        }]
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
    const annualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).find(keySearch)
    return annualLeave;
}

/**
 * Lấy số lượng ngày nghỉ phép đã được chấp nhận của nhân viên theo email và năm
 * @param {*} email : email công ty nhân viên
 * @param {*} company : Id công ty
 */
exports.getNumberAnnaulLeave = async (portal, email, year, company) => {
    let employee = await Employee(connect(DB_CONNECTION, portal)).findOne({
        company: company,
        emailInCompany: email
    }, {
        _id: 1
    });

    if (employee) {
        let firstDay = new Date(year, 0, 1);
        let lastDay = new Date(Number(year) + 1, 0, 1);

        let annulLeaves = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
            company: company,
            employee: employee._id,
            status: 'approved',
            startDate: {
                "$gt": firstDay,
                "$lte": lastDay
            }
        });

        let listAnnualLeavesOfOneYear = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
            company: company,
            employee: employee._id,
            startDate: {
                "$gt": firstDay,
                "$lte": lastDay
            }
        });

        let total = 0,
            data = [];

        annulLeaves.forEach(x => {
            let check = false;
            data.forEach(y => {
                if (x.startDate === y.startDate && x.endDate === y.endDate) {
                    check = true;
                }
            })
            if (!check) {
                data = [...data, x];
            }
        })

        data.forEach(x => {
            if (x.totalHours && x.totalHours !== 0) {
                total = total + (x.totalHours/8);
            } else {
                total = total + Math.round((new Date(x.endDate).getTime() - new Date(x.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1;
            }
        });

        return {
            numberAnnulLeave: total.toFixed(1),
            listAnnualLeavesOfOneYear: listAnnualLeavesOfOneYear

        }
    }

    return {
        numberAnnulLeave: 0,
        listAnnualLeavesOfOneYear: []
    }
}

/**
 * Lấy tổng số thông tin nghỉ phép theo đơn vị (phòng ban) và tháng 
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị tìm kiếm
 * @month : Tháng tìm kiếm
 */
exports.getTotalAnnualLeave = async (portal, company, organizationalUnits, month) => {
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

    let totalListOfYear = 0;
    // Bắt sựu kiện tháng tìm kiếm khác "", undefined
    if (month !== undefined && month.length !== 0) {
        let date = new Date(month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await AnnualLeave(connect(DB_CONNECTION, portal)).countDocuments({
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
        totalListOfYear = await AnnualLeave(connect(DB_CONNECTION, portal)).countDocuments({
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

    let listAnnulLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).find(keySearch);
    return {
        totalList: listAnnulLeave.length,
        totalListAnnulLeave: listAnnulLeave,
        totalListOfYear
    };
}

/**
 * Lấy thông tin nghỉ phép trong 6 hoặc 12 tháng gần nhất theo đơn vị
 * @param {*} organizationalUnits: array id đơn vị
 * @param {*} numberMonth : Số tháng cần lấy thông tin nghỉ phép (6 hoặc 12)
 * @param {*} company : Id công ty
 */
exports.getAnnualLeaveByStartDateAndEndDate = async (portal, organizationalUnits, startDate, endDate, company) => {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        return {
            arrMonth: [],
            listAnnualLeaveOfNumberMonth: [],
        }
    } else {
        let endMonth = new Date(endDate).getMonth();
        let endYear = new Date(endDate).getFullYear();
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
                if (`${startDate}-01` === month) {
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
                    month = `${endYear-j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear-j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
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

        if (organizationalUnits) {
            let listAnnualLeaveOfNumberMonth = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
                company: company,
                status: 'approved',
                organizationalUnit: {
                    $in: organizationalUnits
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
            let listAnnualLeaveOfNumberMonth = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
                company: company,
                status: 'approved',
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
}



/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchAnnualLeaves = async (portal, params, company) => {
    let keySearch = {
        company: company
    };

    // Bắt sựu kiện MSNV hoặc tên nhân viên tìm kiếm khác undefined
    if (params.employeeNumber || params.employeeName) {
        let keySearchEmployee = {
            company: company
        };
        if(params.employeeNumber){
            keySearchEmployee = {
                ...keySearchEmployee,
                employeeNumber: {
                    $regex: params.employeeNumber,
                    $options: "i"
                }
            }
        };
        if(params.employeeName){
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
    if (params.status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: params.status
            }
        }
    };

    // Bắt sựu kiện tìm kiếm theo tháng 
    if (params.month) {
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
    let listAnnualLeaves = await AnnualLeave(connect(DB_CONNECTION, portal)).find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber'
        })
        .sort({
            'createdAt': 'desc'
        }).skip(params.page).limit(params.limit);
    let totalList = await AnnualLeave(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

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
exports.createAnnualLeave = async (portal, data, company) => {
    // Tạo mới thông tin nghỉ phép vào database
    let createAnnualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).create({
        employee: data.employee,
        company: company,
        organizationalUnit: data.organizationalUnit,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        totalHours: data.totalHours,
        status: data.status,
        reason: data.reason,
    });

    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
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
exports.deleteAnnualLeave = async (portal, id) => {
    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.updateAnnualLeave = async (portal, id, data) => {
    let annualLeave = await AnnualLeave(connect(DB_CONNECTION, portal)).findById(id);

    annualLeave.startDate = data.startDate;
    annualLeave.status = data.status;
    annualLeave.endDate = data.endDate;
    annualLeave.reason = data.reason;
    annualLeave.startTime = data.startTime;
    annualLeave.endTime = data.endTime;
    annualLeave.type = data.type;
    annualLeave.totalHours = data.totalHours;

    await annualLeave.save();

    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }]);
}

/**
 * import dữ liệu nghỉ phép
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importAnnualLeave = async (portal, data, company) => {
    let users = await UserService.getAllEmployeeOfUnitByIds(portal, [data[0].organizationalUnit]);
    users = users.map(x => x.userId.email);
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find({
        company: company,
        emailInCompany: {
            $in: users
        }
    }, {
        employeeNumber: 1,
        _id: 1
    });

    let rowError = [];
    data = data.map((x, index) => {
        let employee = employeeInfo.filter(y => y.employeeNumber === x.employeeNumber);
        if (employee.length === 0) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "staff_code_not_find"],
                error: true
            };
            rowError = [...rowError, index + 1];
        } else {
            x = {
                ...x,
                employee: employee[0]._id,
                company: company
            };
        }
        return x;
    })

    if (rowError.length !== 0) {
        return {
            data,
            rowError
        }
    } else {
        return await AnnualLeave(connect(DB_CONNECTION, portal)).insertMany(data);
    }
}