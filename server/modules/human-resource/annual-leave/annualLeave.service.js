const EmployeeService = require('../profile/profile.service');
const { Employee, AnnualLeave} = require('../../../models').schema;

/**
 * Lấy danh sách thông tin nghỉ phép
 * @data: dữ liệu key tìm kiếm
 * @company: id công ty người dùng
 */ 
exports.searchAnnualLeaves = async (data, company) => {
    let keySearchEmployee, keySearch = {company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (data.organizationalUnit !== null) {
        let emailInCompany =await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(data.organizationalUnit, data.position);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }

    //Bắt sựu kiện MSNV tìm kiếm khác ""
    if (data.employeeNumber !== "") {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: data.employeeNumber, $options: "i"}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id);
        keySearch = {...keySearch, employee: {$in: employee}}
    }

    //Bắt sựu kiện trạng thái tìm kiếm khác null
    if (data.status !== null) {
        keySearch = {...keySearch, status: {$in: data.status}}
    };

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (data.month !== "" && data.month !==null) {
        var date = new Date(data.month);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        keySearch = {...keySearch,"$or": [{startDate: {"$gt": firstDay, "$lte": lastDay}}, {endDate: {"$gt": firstDay, "$lte": lastDay}}]}
    };
    var totalList = await AnnualLeave.count(keySearch);
    var listAnnualLeaves = await AnnualLeave.find(keySearch).populate({ path: 'employee', model: Employee })
        .sort({ 'createdAt': 'desc' }).skip(data.page).limit(data.limit);
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
        var partStart = data.startDate.split('-');
        var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        var partEnd = data.endDate.split('-');
        var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
        // Tạo mới thông tin nghỉ phép vào database
        var createAnnualLeave = await AnnualLeave.create({
            employee: employeeInfo._id,
            company: company,
            startDate: startDate,
            endDate: endDate,
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
        var partStart = data.startDate.split('-');
        var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        var partEnd = data.endDate.split('-');
        var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
        var AnnualLeaveChange = {
            employee: employeeInfo._id,
            startDate: startDate,
            endDate: endDate,
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