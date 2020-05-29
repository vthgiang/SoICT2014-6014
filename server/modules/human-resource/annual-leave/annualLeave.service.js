const EmployeeService = require('../profile/profile.service');
const { Employee, AnnualLeave} = require('../../../models').schema;

/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : dữ liệu key tìm kiếm
 * @company : id công ty người dùng
 */ 
exports.searchAnnualLeaves = async (params, company) => {
    let keySearchEmployee, keySearch = {company: company};
    console.log(params);

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnit !== undefined) {
        let emailInCompany =await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnit, params.position);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }

    //Bắt sựu kiện MSNV tìm kiếm khác "", undefined
    if (params.employeeNumber !== undefined && params.employeeNumber.length !==0) {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: params.employeeNumber, $options: "i"}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id);
        keySearch = {...keySearch, employee: {$in: employee}}
    }

    //Bắt sựu kiện trạng thái tìm kiếm khác undefined
    if (params.status !== undefined) {
        keySearch = {...keySearch, status: {$in: params.status}}
    };

    //Bắt sựu kiện tháng tìm kiếm khác "", undefined
    if (params.month !== undefined && params.month.length !== 0) {
        var date = new Date(params.month);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        keySearch = {...keySearch,"$or": [{startDate: {"$gt": firstDay, "$lte": lastDay}}, {endDate: {"$gt": firstDay, "$lte": lastDay}}]}
    };
    var totalList = await AnnualLeave.count(keySearch);
    var listAnnualLeaves = await AnnualLeave.find(keySearch).populate({ path: 'employee', model: Employee })
        .sort({ 'createdAt': 'desc' }).skip(params.page).limit(params.limit);
    for (let n in listAnnualLeaves) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listAnnualLeaves[n].employee.emailInCompany);
        listAnnualLeaves[n] = {...listAnnualLeaves[n]._doc, ...value }
    }

    return {totalList, listAnnualLeaves}
}

/**
 * Thêm mới thông tin nghỉ phép
 * @data: dữ liệu nghỉ phép mới
 * @company: id công ty người tạo
 */ 
exports.createAnnualLeave = async (data, company) => {
    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company }, { _id: 1, emailInCompany: 1 });
    if(employeeInfo!==null){
        // Tạo mới thông tin nghỉ phép vào database
        var createAnnualLeave = await AnnualLeave.create({
            employee: employeeInfo._id,
            company: company,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
        });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
        
        // Lấy thông tin nghỉ phép vừa tạo 
        var newAnnualLeave = await AnnualLeave.findOne({ _id: createAnnualLeave._id }).populate([{ path: 'employee', model: Employee }])
        
        return { ...newAnnualLeave._doc, ...value}
    } else return null;
}

/**
 * Xoá thông tin nghỉ phép
 * @id: id nghỉ phép muốn xoá
 */ 
exports.deleteAnnualLeave = async (id) => {
    return await AnnualLeave.findOneAndDelete({ _id: id });
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id: id nghỉ phép muốn chỉnh sửa
 * @data: dữ liệu thay đổi
 */ 
exports.updateAnnualLeave = async (id, data) => {
    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber }, { _id: 1, emailInCompany: 1 });
    if(employeeInfo!==null){
        var AnnualLeaveChange = {
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
        };

        // Cập nhật thông tin nghỉ phép vào database
        await AnnualLeave.findOneAndUpdate({ _id: id }, { $set: AnnualLeaveChange });
        
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
        
        // Lấy thông tin nghỉ phép vừa cập nhật
        var updateAnnualLeave = await AnnualLeave.findOne({ _id:id }).populate([{ path: 'employee', model: Employee }])
        
        return {...updateAnnualLeave._doc, ...value}
    } else return null;
}