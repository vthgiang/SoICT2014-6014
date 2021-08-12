const UserService = require(`../../super-admin/user/user.service`);
const mongoose = require("mongoose");
const {
    Employee,
    Salary,
    OrganizationalUnit,
    UserRole,
    User,
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);

/**
 * Lấy danh sách các bảng lương của nhân viên
 * @params : Dữ liệu các key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchSalaries = async (portal, params, company) => {
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

    // Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month && params.month.length !== 0) {
        keySearch = {
            ...keySearch,
            month: new Date(params.month)
        }
    };

    // Lấy danh sách bảng lương
    let listSalarys = await Salary(connect(DB_CONNECTION, portal)).find(keySearch).populate({
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber birthdate gender status'
        })
        .sort({
            'createdAt': 'desc'
        }).skip(params.page).limit(params.limit);

    let totalList = await Salary(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    return {
        totalList,
        listSalarys
    }
}

exports.getAllSalaryByMonthAndOrganizationalUnits = async (portal, organizationalUnits, month) => {
    let keySearch = {
        month: new Date(month)
    };

    // Bắt sựu kiện tìm kiếm theo đơn vị
    if (organizationalUnits) {
        keySearch = {
            ...keySearch,
            organizationalUnit: {
                $in: organizationalUnits
            }
        };
    }

    let salaris =  await Salary(connect(DB_CONNECTION, portal)).find(keySearch).populate({
        path: 'employee',
        select: 'avatar emailInCompany fullName employeeNumber'
    });

    return salaris;
}


/**
 *  Thêm mới bảng lương mới 
 *  @data : Dữ liệu bảng lương
 *  @company : Id công ty
 */
exports.createSalary = async (portal, data, company) => {
    let month = new Date(data.month);
    let isSalary = await Salary(connect(DB_CONNECTION, portal)).findOne({
        company: company,
        employee: data.employee,
        organizationalUnit: data.organizationalUnit,
        month: month
    }, {
        field1: 1
    });

    if (isSalary !== null) {
        return "have_exist"
    } else {
        let createSalary = await Salary(connect(DB_CONNECTION, portal)).create({
            company: company,
            employee: data.employee,
            organizationalUnit: data.organizationalUnit,
            month: month,
            mainSalary: data.mainSalary,
            unit: data.unit,
            bonus: data.bonus
        });

        // Lấy thông tin bảng lương vừa tạo
        return await Salary(connect(DB_CONNECTION, portal)).findOne({
            _id: createSalary._id
        }).populate([{
            path: 'employee',
            select: 'emailInCompany fullName employeeNumber birthdate gender status'
        }])
    }
}

/**
 * Xoá bẳng lương
 * @id : Id bảng lương
 */
exports.deleteSalary = async (portal, id) => {
    return await Salary(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin bảng lương
 * @id : Id bảng lương muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 * @company : Id công ty
 */
exports.updateSalary = async (portal, id, data) => {
    let salaryChange = {
        mainSalary: data.mainSalary,
        unit: data.unit,
        bonus: data.bonus,
    };
    await Salary(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: salaryChange
    });

    // Lấy thông tin bảng lương vừa cập nhật
    return await Salary(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([{
        path: 'employee',
        select: 'emailInCompany fullName employeeNumber birthdate gender status'
    }])
}

/**
 * import dữ liệu bảng lương 
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importSalaries = async (portal, data, company) => {
    // lâys danh sách tất cả employees
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find({
    }, {
        employeeNumber: 1,
        _id: 1
    });
    
    //Lấy danh sách đơn vị
    let organizationalUnitId = [];
    data.forEach(x => {
        organizationalUnitId = [...organizationalUnitId, x.organizationalUnit]
    })

    // loại bỏ đơn vị trùng lặp
    const seen = new Set();
    organizationalUnitId = organizationalUnitId.filter((el) => {
        const duplicate = seen.has(el);
        seen.add(el);
        return !duplicate;
    });


    let listSalary = {}, listEmployeeUnits = [];
    let users = [], rowError = [], result = [];

    if (organizationalUnitId?.length) {
        // Lấy danh sách nhân viên của các đơn vị
        let roles = [];
        let units = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ '_id': { $in: organizationalUnitId.map(item => mongoose.Types.ObjectId(item)) } });
        for (let i = 0; i < units.length; i++) {
            roles = [
                ...roles,
                ...units[i].employees,
                ...units[i].managers,
                ...units[i].deputyManagers
            ]
        }
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
        users = users.map(item => {
            if (item?.user?.[0]) {
                item.user[0].idUnit = item?.organizationalUnit?.[0]?._id
                return item.user[0]
            }
        });
        await User(connect(DB_CONNECTION, portal)).populate(users, { path: "userId", select: "email" });
       
        // gom nhóm các nhân viên theo đơn vị
        users = users.reduce((groups, item) => {
                groups[item.idUnit] = [...groups[item.idUnit] || [], item?.userId?.email];
                return groups;
        }, {});

        for (let k = 0; k < organizationalUnitId?.length; k++){
            // láy danh sách các bảng lương từng đơn vị theo tháng
            let salaryExisted = await Salary(connect(DB_CONNECTION, portal)).find({
                month: data[0].month,
                organizationalUnit: organizationalUnitId[k],
            });
            if (salaryExisted)
                listSalary[organizationalUnitId[k]] = salaryExisted;
            
            // Dựa vào email user đã lấy dc ở bước trên láy thông tin nhân sự của từng người vì user email liên kết với email employees
            let listEmployeeInUnit = await Employee(connect(DB_CONNECTION, portal)).find({
                emailInCompany: {
                    $in: users[organizationalUnitId[k]]
                }
            }, {
                employeeNumber: 1,
                _id: 1
            });
            
            listEmployeeUnits[organizationalUnitId[k]] = listEmployeeInUnit
        }

        data.forEach((x, index) => {
            let row = {...x};
            if (x?.organizationalUnit) {
                let checkEmployeeNumber = employeeInfo.filter(y => y.employeeNumber.toString() === x.employeeNumber.toString());
                // kiểm tra nhân viên có tồn tại hay chưa
                if (checkEmployeeNumber?.length === 0) { // nếu chưa có trả về lôix
                    row = { ...row, errorAlert: [...x.errorAlert, "staff_code_not_find"], error: true };
                    rowError = [...rowError, index + 1];
                } else {
                    let checkEmployeeNumberInUnit = listEmployeeUnits[x.organizationalUnit].some(y => y.employeeNumber.toString() === x.employeeNumber.toString());
                    // nếu nhân vien ko thuộc đơn vị đã điền trong excell thì trar về loõi
                    if (!checkEmployeeNumberInUnit) {
                        row = { ...row, errorAlert: [...x.errorAlert, "staff_non_unit"], error: true };
                        rowError = [...rowError, index + 1];
                    } else {
                        // Nếu nhân viên đã thuộc đơn vị rồi - tiếp tục kiểm tra xem nhân viên đấy đã tồn tại bảng lương tháng định nhập hay chưa
                        if (Object.keys(listSalary)?.length) {
                            let monthSalary = new Date(x.month);
                            // console.log('monthSalary', monthSalary(connect(DB_CONNECTION, portal)).toString());
                            let checkEmployeeSalary = listSalary[x.organizationalUnit].some(y => y.employee.toString() === checkEmployeeNumber[0]._id.toString() && monthSalary.toString() === y.month.toString() );
                            if (checkEmployeeSalary) {
                                row = { ...row, errorAlert: [...x.errorAlert, "month_salary_have_exist"], error: true };
                                rowError = [...rowError, index + 1];
                            } else {
                                row = { ...row, employee: checkEmployeeNumber[0]._id.toString(), company: company };
                            }
                        }
                    }
                }
            } else { // nêú có rồi.. tiếp tục kiểm tra nhân viên thuộc đơn vị đã điền trong file hay ko
                row = { ...row, errorAlert: [...x.errorAlert, "organizationalUnit_not_found"] };
                rowError = [...rowError, index + 1];
            }
            result = [...result, row];
        })
    }
        
    if (rowError.length !== 0) {
        return {
            data : result,
            rowError
        }
    } else {
        console.log('SAVE')
        return await Salary(connect(DB_CONNECTION, portal)).insertMany(result);
    }
}