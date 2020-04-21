const Praise = require('../../../models/human-resource/commendation.model');
const Employee = require('../../../models/human-resource/employee.model');
const EmployeeService = require('../profile/profile.service');

// Lấy danh sách khen thưởng của nhân viên
exports.searchCommendations = async (data, company) => {
    var keySearchEmployee, keySearch = { company: company};
    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (data.unit !== null) {
        let emailCompany =await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(data.unit, data.position);
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
    // Lấy danh sách khen thưởng
    var totalList = await Praise.count(keySearch);
    var listPraise = await Praise.find(keySearch).populate({path: 'employee', model: Employee})
        .sort({'createDate': 'desc'}).skip(data.page).limit(data.limit);
    for (let n in listPraise) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listPraise[n].employee.emailCompany);
        listPraise[n] = {...listPraise[n]._doc, ...value}
    }
    return {totalList, listPraise}
}

// Thêm mới khen thưởng
exports.createCommendation = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        var isPraise = await Praise.findOne({employee: employeeInfo._id, company: company, number: data.number}, {field1: 1});
        if (isPraise !== null) {
            return "have_exist"
        } else {
            // Thêm khen thưởng vào database
            var createPraise = await Praise.create({
                employee: employeeInfo._id,
                company: company,
                number: data.number,
                unit: data.unit,
                startDate: data.startDate,
                type: data.type,
                reason: data.reason,
            });
            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailCompany);
            //Lấy thông tin khen thưởng vừa tạo
            let newPraise = await Praise.findOne({_id: createPraise._id}).populate([{path: 'employee', model: Employee}])
            return {...newPraise._doc, ...value}
        }
    } else return null
}

// Xoá thông tin khen thưởng
exports.deleteCommendation = async (id) => {
    return await Praise.findOneAndDelete({_id: id});
}

// Chỉnh sửa thông tin khen thưởng
exports.updateCommendation = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        var praiseChange = {
            employee: employeeInfo._id,
            number: data.number,
            unit: data.unit,
            startDate: data.startDate,
            type: data.type,
            reason: data.reason,
            updateDate: Date.now()
        };
        // Cập nhật thông tin khen thưởng vào database
        await Praise.findOneAndUpdate({_id: id}, {$set: praiseChange});
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailCompany);
        // Lấy thông tin khen thưởng vừa cập nhật
        var updatePraise = await Praise.findOne({_id: id}).populate([{path: 'employee', model: Employee}])
        return {...updatePraise._doc, ...value};
    } else return null 
}