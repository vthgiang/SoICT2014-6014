const Discipline = require('../../../models/discipline.model');
const Employee = require('../../../models/employee.model');
const EmployeeService = require('../employee/employee.service');

// Lấy danh sách kỷ luật của nhân viên
exports.get = async (data, company) => {
    var keySearchEmployee, keySearch = { company: company};
    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (data.unit !== null) {
        let emailCompany =await EmployeeService.getEmailCompanyByUnitAndPosition(data.unit, data.position);
        keySearchEmployee = {...keySearchEmployee, emailCompany: {$in: emailCompany}}
    }
    // Bắt sựu kiện MSNV tìm kiếm khác ""
    if (data.employeeNumber !== "") {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: data.employeeNumber, $options: "i"}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id); 
            keySearch = {...keySearch, employee: { $in: employee}}
    }
    // Bắt sựu kiện số quyết định tìm kiếm khác ""
    if (data.number !== "") {
        keySearch = {...keySearch, number: {$regex: data.number, $options: "i"}}
    };
    // Lấy danh sách kỷ luật
    var totalList = await Discipline.count(keySearch);
    var listDiscipline = await Discipline.find(keySearch).populate({path: 'employee', model: Employee})
        .sort({'createDate': 'desc'}).skip(data.page).limit(data.limit);
    for (let n in listDiscipline) {
        let value = await EmployeeService.getUnitAndPositionEmployee(listDiscipline[n].employee.emailCompany);
        listDiscipline[n] = {...listDiscipline[n]._doc, ...value}
    }
    return {totalList, listDiscipline}
}

// Thêm mới kỷ luật
exports.create = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        var isDiscipline = await Discipline.findOne({employee: employeeInfo._id, company: company, number: data.number}, {field1: 1});
        if (isDiscipline !== null){
            return "have_exist"
        } else {
            // Thêm kỷ luật vào database
            var createDiscipline = await Discipline.create({
                employee: employeeInfo._id,
                company: company,
                number: data.number,
                unit: data.unit,
                startDate: data.startDate,
                endDate: data.endDate,
                type: data.type,
                reason: data.reason,
            });
            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
            //Lấy thông tin kỷ luật vừa tạo
            let newDiscipline = await Discipline.findOne({_id: createDiscipline._id}).populate([{path: 'employee', model: Employee}]);
            return {...newDiscipline._doc, ...value}
        }
    } else return null;
}

// Xoá thông tin kỷ luật
exports.delete = async (id) => {
    return await Discipline.findOneAndDelete({_id: id});
}

// Chỉnh sửa thông tin kỷ luật
exports.update = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        let DisciplineChange = {
            employee: employeeInfo._id,
            number: data.number,
            unit: data.unit,
            startDate: data.startDate,
            endDate: data.endDate,
            type: data.type,
            reason: data.reason,
            updateDate: Date.now()
        };
        // Cập nhật thông tin kỷ luật vào database
        await Discipline.findOneAndUpdate({_id: id}, {$set: DisciplineChange});
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
        // Lấy thông tin kỷ luật vừa cập nhật
        var updateDiscipline = await Discipline.findOne({_id: id}).populate([{path: 'employee', model: Employee}]);
        return {...updateDiscipline._doc, ...value}
    } else return null
}