const UserService = require(`../../super-admin/user/user.service`);
const {
    Employee,
    AnnualLeave,
    Privilege,
    UserRole,
    Link,
    User,
    OrganizationalUnit
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);

const mongoose = require('mongoose')

exports.getAnnaulLeaveBeforAndAfterOneWeek =async (portal, organizationalUnits,company) =>{
    const dateNow = new Date();
    let firstDay = new Date();
    let lastDay = new Date();
    firstDay = new Date(firstDay.setDate(dateNow.getDate() - 6))
    lastDay = new Date(lastDay.setDate(dateNow.getDate() + 6))
    let keySearch = {
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
        emailInCompany: email
    }, {
        _id: 1
    });

    if (employee) {
        let firstDay = new Date(year, 0, 1);
        let lastDay = new Date(Number(year) + 1, 0, 1);

        let annulLeaves = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
            employee: employee._id,
            status: 'approved',
            startDate: {
                "$gt": firstDay,
                "$lte": lastDay
            }
        });

        let listAnnualLeavesOfOneYear = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
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
        totalListOfYear,
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
 * Lấy thông tin nghỉ phép trong 6 hoặc 12 tháng gần nhất theo đơn vị
 * @param {*} organizationalUnits: array id đơn vị
 * @param {*} numberMonth : Số tháng cần lấy thông tin nghỉ phép (6 hoặc 12)
 * @param {*} company : Id công ty
 * @param {*} employeeName: tên nhân viên
 */
 exports.getAnnualLeaveByStartDateAndEndDateUserOfOrganizationalUnits = async (portal,email, organizationalUnits, startDate, endDate, company) => {
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
            let keySearchEmployee = {
            };
            if(email){
                keySearchEmployee = {
                    ...keySearchEmployee,
                    emailInCompany: {
                        $regex: email,
                        $options: "i"
                    }
                }
            };
            let employee = await Employee(connect(DB_CONNECTION, portal)).find(keySearchEmployee, {
                _id: 1
            });
            let listAnnualLeaveOfNumberMonth = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
                status: 'approved',
                organizationalUnit: {
                    $in: organizationalUnits
                },
                employee: {
                    $in: employee
                },
                "$or": querys
            }, {
            })
            return {
                listAnnualLeaveOfNumberMonth,
                arrMonth
            }
        } else {
            let listAnnualLeaveOfNumberMonth = await AnnualLeave(connect(DB_CONNECTION, portal)).find({
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
/**Lay tong so don nghi phep cho phe duyet trong thang */
const fetchNumberOfWaitForAppoval = async (portal, params, company) => {

    let currentMonth = new Date();
    let firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    let lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    let keySearch = {
        startDate: 
            {
                "$gte": firstDay,
                "$lt": lastDay
            },
        endDate: 
            {
                "$gte": firstDay,
                "$lt": lastDay
            }
    }
    
    if (params.organizationalUnits) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: params.organizationalUnits.map(item => mongoose.Types.ObjectId(item))
            }
        };
    }

    let arrayOfListAbsentLetter = await AnnualLeave(connect(DB_CONNECTION, portal)).aggregate([
        { $match: 
            keySearch 
        },
        { 
            $group: {
                _id: '$status',
                count: { $sum: 1}
            }
        }
    ])

    let numberOfWaitForApproval, numberApproved, numberNotApproved
    
    for(let i = 0; i < arrayOfListAbsentLetter.length; i++) {
        
        switch(arrayOfListAbsentLetter[i]._id) {
            case 'waiting_for_approval': {
                numberOfWaitForApproval = arrayOfListAbsentLetter[i].count;
                break;
            }
            case 'approved': {
                numberApproved = arrayOfListAbsentLetter[i].count;
                break;
            }
            case 'disapproved': {
                numberNotApproved = arrayOfListAbsentLetter[i].count;
            }
        }
    }

    return {
        numberOfWaitForApproval: numberOfWaitForApproval || 0,
        numberApproved: numberApproved || 0,
        numberNotApproved: numberNotApproved || 0
    }
}


/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchAnnualLeaves = async (portal, params, company) => {
    console.log("DMDMMDMDMD MAY")
    let keySearch = {
    };

    // Bắt sựu kiện MSNV hoặc tên nhân viên tìm kiếm khác undefined
    if (params.employeeNumber || params.employeeName) {
        let keySearchEmployee = {
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
                numberWaitForApproval: 0,
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

    let { numberOfWaitForApproval, numberApproved, numberNotApproved} = await fetchNumberOfWaitForAppoval(portal, params, company);
    
    return {
        totalList,
        listAnnualLeaves,
        numberWaitForApproval: numberOfWaitForApproval,
        numberApproved: numberApproved,
        numberNotApproved: numberNotApproved
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
        // company: company,
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

    let userReceiveds = [];
    const link = await Link(connect(DB_CONNECTION, portal)).find({ url: "/hr-annual-leave" });
    if (link.length) {
        const privilege = await Privilege(connect(DB_CONNECTION, portal)).find({ resourceId: link[0]._id });
        if (privilege.length) {
            let roleIds = [];
            for (let i in privilege) {
                roleIds.push(privilege[i].roleId);
            }
            const userRoles = await UserRole(connect(DB_CONNECTION, portal)).find({ roleId: { $in: roleIds } })
           
            if (userRoles && userRoles.length > 0) {
                for (let j in userRoles) {
                    userReceiveds = [...userReceiveds, userRoles[j].userId];
                }
            }
        }
    }

    const result =  await AnnualLeave(connect(DB_CONNECTION, portal)).findOne({
        _id: createAnnualLeave._id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber'
    }])

    return {result, userReceiveds}
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép muốn xoá
 */
exports.deleteAnnualLeave = async (portal, id) => {
    return await AnnualLeave(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    }).populate({path: "employee", select: "emailInCompany fullName employeeNumber"});
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
    // lâys danh sách tất cả employees
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find({
    }, {
        employeeNumber: 1,
        _id: 1
    });


    //Lấy danh sách đơn vị
    let organizationalUnitId = [];
    data.forEach(x => {
        organizationalUnitId = [...organizationalUnitId, x.organizationalUnitId]
    })


    // loại bỏ đơn vị trùng lặp
    const seen = new Set();
    organizationalUnitId = organizationalUnitId.filter((el) => {
        const duplicate = seen.has(el);
        seen.add(el);
        return !duplicate;
    });


    let listEmployeeUnits = [];
    let users = [], rowError = [];

    if (organizationalUnitId?.length) {
        console.log("4")
        for (let k = 0; k < organizationalUnitId?.length; k++) {
            // ----Lấy danh sách nhân viên của các đơn vị
            let roles = [];
            let units = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ '_id': organizationalUnitId[k] });
            for (let i = 0; i < units.length; i++) {
                roles = [
                    ...roles,
                    ...units[i].employees,
                    ...units[i].managers,
                    ...units[i].deputyManagers
                ]
            }

            // laays danh sach user thuoc don vi
            users = await UserRole(connect(DB_CONNECTION, portal)).aggregate([
                {
                    
                    $match: {'roleId': { $in: roles }}
                },
                {
                    $group: {
                        '_id': '$userId',
                        'user': { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        "from": "organizationalunits",
                        "let": { "roleId": "$user.roleId" },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$managers", "$$roleId"] },
                                            { $eq: ["$deputyManagers", "$$roleId"] },
                                            { $eq: ["$employees", "$$roleId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        "as": "organizationalUnit"
                    }
                }
            ])
console.log("5")
            users = users.map(item => {
                if (item?.user?.[0]) {
                    item.user[0].idUnit = item?.organizationalUnit?.[0]?._id
                    return item.user[0]
                }
            });
console.log("6")
            await User(connect(DB_CONNECTION, portal)).populate(users, { path: "userId", select: "email" });

            let listMail = [];
            users?.length && users.forEach(x => listMail = [...listMail, x?.userId?.email]);

            // timf danh sach nhan vien thong qua danh sach email
            let listEmployeeInUnit = await Employee(connect(DB_CONNECTION, portal)).find({
                emailInCompany: {
                    $in: listMail
                }
            }, {
                employeeNumber: 1,
                _id: 1
            });

            listEmployeeUnits[organizationalUnitId[k]] = listEmployeeInUnit
        }
    }

    // validate dữ liệu
    data = data.map((x, index) => {
        let checkEmployeeNumber = employeeInfo.filter(y => y.employeeNumber.toString() === x.employeeNumber.toString());
        
        // kiểm tra nhân viên có tồn tại hay chưa
        if (checkEmployeeNumber?.length === 0) { // nếu chưa có trả về lôix
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "staff_code_not_find"],
                error: true
            }
            rowError = [...rowError, index + 1];
        } else {
            let checkEmployeeNumberInUnit = listEmployeeUnits[x.organizationalUnitId].some(y => y.employeeNumber.toString() === x.employeeNumber.toString());
            // nếu nhân vien ko thuộc đơn vị đã điền trong excell thì trar về loõi
            if (!checkEmployeeNumberInUnit) {
                x = {
                    ...x,
                    errorAlert: [...x.errorAlert, "staff_non_unit"],
                    error: true,
                };
                rowError = [...rowError, index + 1];
            } else {
                x = {
                    ...x,
                    employee: checkEmployeeNumber[0]._id.toString(),
                    organizationalUnit: x.organizationalUnitId
                }
            }
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

exports.getAnnualLeaveById = async (portal, id) => {
    return await AnnualLeave(connect(DB_CONNECTION, portal))
        .findById(id)
    .populate({path: "employee", select : "fullName employeeNumber"})
}