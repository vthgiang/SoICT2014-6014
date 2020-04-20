const Sabbatical = require('../../../models/human-resource/annualLeave.model');
const Employee = require('../../../models/human-resource/employee.model');
const EmployeeService = require('../profile/profile.service');

// Lấy danh sách thông tin nghỉ phép
exports.get = async (data, company) => {
    let keySearchEmployee, keySearch = {company: company};
    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (data.unit !== null) {
        let emailCompany =await EmployeeService.getEmailCompanyByUnitAndPosition(data.unit, data.position);
        keySearchEmployee = {...keySearchEmployee, emailCompany: {$in: emailCompany}}
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
        keySearch = {...keySearch,startDate: {$regex: data.month,$options: "i"},
            endDate: {$regex: data.month, $options: "i"}}
    };
    var totalList = await Sabbatical.count(keySearch);
    var listSabbatical = await Sabbatical.find(keySearch).populate({ path: 'employee', model: Employee })
        .sort({ 'createDate': 'desc' }).skip(data.page).limit(data.limit);
    for (let n in listSabbatical) {
        let value = await EmployeeService.getUnitAndPositionEmployee(listSabbatical[n].employee.emailCompany);
        listSabbatical[n] = {...listSabbatical[n]._doc, ...value }
    }
    return {totalList, listSabbatical}
}

// Thêm mới thông tin nghỉ phép
exports.create = async (data, company) => {
    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company }, { _id: 1, emailCompany: 1 });
    if(employeeInfo!==null){
        // Tạo mới thông tin nghỉ phép vào database
        var createSabbatical = await Sabbatical.create({
            employee: employeeInfo._id,
            company: company,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
        });
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
        // Lấy thông tin nghỉ phép vừa tạo 
        var newSabbatical = await Sabbatical.findOne({ _id: createSabbatical._id }).populate([{ path: 'employee', model: Employee }])
        return { ...newSabbatical._doc, ...value}
    } else return null;
}

// Xoá thông tin nghỉ phép
exports.delete = async (id) => {
    return await Sabbatical.findOneAndDelete({ _id: id });
}

// Cập nhật thông tin nghỉ phép
exports.update = async (id, data) => {
    // Lấy thông tin nhân viên theo mã số nhân viên
    var employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber }, { _id: 1, emailCompany: 1 });
    if(employeeInfo!==null){
        var SabbaticalChange = {
            employee: employeeInfo._id,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            reason: data.reason,
            updateDate:Date.now()
        };
        // Cập nhật thông tin nghỉ phép vào database
        await Sabbatical.findOneAndUpdate({ _id: id }, { $set: SabbaticalChange });
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
        // Lấy thông tin nghỉ phép vừa cập nhật
        var updateSabbatical = await Sabbatical.findOne({ _id:id }).populate([{ path: 'employee', model: Employee }])
        return {...updateSabbatical._doc, ...value}
    } else return null;
}