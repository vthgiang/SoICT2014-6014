const {
    Discipline,
    Employee
} = require('../../../models').schema;

const EmployeeService = require('../profile/profile.service');

/**
 * Lấy tổng số thông tin khen thường theo đơn vị (phòng ban) và tháng 
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị tìm kiếm
 * @month : Tháng tìm kiếm
 */
exports.getTotalDiscipline = async (company, organizationalUnits, month) => {
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

    // Bắt sựu kiện tháng tìm kiếm khác "", undefined
    let totalListOfYear = 0;
    if (month && month.length !== 0) {
        let date = new Date(month);
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let firstDayOfYear = new Date(date.getFullYear() - 1, 12, 1);
        let lastDayOfYear = new Date(date.getFullYear(), 12, 1);
        totalListOfYear = await Discipline.count({
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
        totalListOfYear = await Discipline.count({
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

    let totalList = await Discipline.count(keySearch);
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
exports.searchDisciplines = async (params, company) => {
    let keySearchEmployee, keySearch = {
        company: company
    };

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnits !== undefined) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnits, params.position);
        keySearchEmployee = {
            ...keySearchEmployee,
            emailInCompany: {
                $in: emailInCompany
            }
        }
    }

    // Bắt sựu kiện MSNV tìm kiếm khác "", undefined
    if (params.employeeNumber !== undefined && params.employeeNumber.length !== 0) {
        keySearchEmployee = {
            ...keySearchEmployee,
            employeeNumber: {
                $regex: params.employeeNumber,
                $options: "i"
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

    // Bắt sựu kiện số quyết định tìm kiếm khác "", undefined
    if (params.decisionNumber !== undefined && params.decisionNumber.length !== 0) {
        keySearch = {
            ...keySearch,
            decisionNumber: {
                $regex: params.decisionNumber,
                $options: "i"
            }
        }
    };

    // Lấy danh sách kỷ luật
    let totalList = await Discipline.count(keySearch);
    let listDisciplines = await Discipline.find(keySearch).populate({
            path: 'employee',
            model: Employee
        })
        .sort({
            'createDate': 'desc'
        }).skip(params.page).limit(params.limit);
    for (let n in listDisciplines) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listDisciplines[n].employee.emailInCompany);
        listDisciplines[n] = {
            ...listDisciplines[n]._doc,
            ...value
        }
    }

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
exports.createDiscipline = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    }, {
        _id: 1,
        emailInCompany: 1
    });
    if (employeeInfo !== null) {
        let isDiscipline = await Discipline.findOne({
            employee: employeeInfo._id,
            company: company,
            decisionNumber: data.decisionNumber
        }, {
            field1: 1
        });
        if (isDiscipline !== null) {
            return "have_exist"
        } else {
            // Thêm kỷ luật vào database
            let partStart = data.startDate.split('-');
            let startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
            let partEnd = data.endDate.split('-');
            let endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
            let createDiscipline = await Discipline.create({
                employee: employeeInfo._id,
                company: company,
                decisionNumber: data.decisionNumber,
                organizationalUnit: data.organizationalUnit,
                startDate: startDate,
                endDate: endDate,
                type: data.type,
                reason: data.reason,
            });

            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);

            // Lấy thông tin kỷ luật vừa tạo
            let newDiscipline = await Discipline.findOne({
                _id: createDiscipline._id
            }).populate([{
                path: 'employee',
                model: Employee
            }]);

            return {
                ...newDiscipline._doc,
                ...value
            }
        }
    } else return null;
}

/**
 *  Xoá thông tin kỷ luật
 * @id : Id kỷ luật cần xoá
 */
exports.deleteDiscipline = async (id) => {
    return await Discipline.findOneAndDelete({
        _id: id
    });
}

/**
 * Chỉnh sửa thông tin kỷ luật
 * @id : Id kỷ luật cần chỉnh sửa
 * @data : Dữ liệu chỉnh sửa kỷ luật
 * @company : Id công ty người chỉnh sửa
 */
exports.updateDiscipline = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({
        employeeNumber: data.employeeNumber,
        company: company
    }, {
        _id: 1,
        emailInCompany: 1
    });
    if (employeeInfo !== null) {
        let partStart = data.startDate.split('-');
        let startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        let partEnd = data.endDate.split('-');
        let endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
        let DisciplineChange = {
            organizationalUnit: data.organizationalUnit,
            startDate: startDate,
            endDate: endDate,
            type: data.type,
            reason: data.reason,
        };

        // Cập nhật thông tin kỷ luật vào database
        await Discipline.findOneAndUpdate({
            _id: id
        }, {
            $set: DisciplineChange
        });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);

        // Lấy thông tin kỷ luật vừa cập nhật
        let updateDiscipline = await Discipline.findOne({
            _id: id
        }).populate([{
            path: 'employee',
            model: Employee
        }]);

        return {
            ...updateDiscipline._doc,
            ...value
        }
    } else return null
}