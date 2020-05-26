const EmployeeService = require('../profile/profile.service');
const { Employee, Commendation } = require('../../../models').schema;

/**
 * Lấy danh sách khen thưởng của nhân viên
 * @data: dữ liệu key tìm kiếm
 * @company: Id công ty người tìm kiếm
 */ 
exports.searchCommendations = async (params, company) => {
    console.log(params);
    var keySearchEmployee, keySearch = { company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnit !== undefined) {
        let emailInCompany =await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnit, params.position);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }

    // Bắt sựu kiện MSNV tìm kiếm khác "", undefined
    if (params.employeeNumber !== undefined && params.employeeNumber.length !== 0) {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: params.employeeNumber, $options: "i"}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id); 
            keySearch = {...keySearch, employee: { $in: employee}}
    }

    // Bắt sựu kiện số quyết định tìm kiếm khác "", undefined
    if (params.decisionNumber !== undefined && params.decisionNumber !== 0) {
        keySearch = {...keySearch, decisionNumber: {$regex: params.decisionNumber, $options: "i"}}
    };

    // Lấy danh sách khen thưởng
    var totalList = await Commendation.count(keySearch);
    var listCommendations = await Commendation.find(keySearch).populate({path: 'employee', model: Employee})
        .sort({'createDate': 'desc'}).skip(params.page).limit(params.limit);
    for (let n in listCommendations) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listCommendations[n].employee.emailInCompany);
        listCommendations[n] = {...listCommendations[n]._doc, ...value}
    }
    
    return {totalList, listCommendations}
}

/**
 * Thêm mới khen thưởng
 * @data: dữ liệu khen thưởng cần thêm
 * @company: Id công ty người thêm
 */ 
exports.createCommendation = async (data, company) => {

    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailInCompany: 1});
    if(employeeInfo!==null){
        var isCommendation = await Commendation.findOne({employee: employeeInfo._id, company: company, decisionNumber: data.decisionNumber}, {field1: 1});
        if (isCommendation !== null) {
            return "have_exist"
        } else {
            // Thêm khen thưởng vào database
            var partStart = data.startDate.split('-');
            var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
            var createCommendation = await Commendation.create({
                employee: employeeInfo._id,
                company: company,
                decisionNumber: data.decisionNumber,
                organizationalUnit: data.organizationalUnit,
                startDate: startDate,
                type: data.type,
                reason: data.reason,
            });

            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
           
            // Lấy thông tin khen thưởng vừa tạo
            let newCommendation = await Commendation.findOne({_id: createCommendation._id}).populate([{path: 'employee', model: Employee}])
            
            return {...newCommendation._doc, ...value}
        }
    } else return null
}

/**
 * Xoá thông tin khen thưởng
 * @id: Id khen thưởng cần xoá
 */ 
exports.deleteCommendation = async (id) => {
    return await Commendation.findOneAndDelete({_id: id});
}

/**
 * Chỉnh sửa thông tin khen thưởng
 * @id: Id khen thương cần chỉnh sửa
 * @data: dữ liệu chỉnh sửa khen thưởng
 * @company: Id công ty người thực hiện thay đổi
 */ 
exports.updateCommendation = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailInCompany: 1});
    if(employeeInfo!==null){
        var partStart = data.startDate.split('-');
        var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        var commendationChange = {
            organizationalUnit: data.organizationalUnit,
            startDate: startDate,
            type: data.type,
            reason: data.reason,
        };
        
        // Cập nhật thông tin khen thưởng vào database
        await Commendation.findOneAndUpdate({_id: id}, {$set: commendationChange});
       
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
        
        // Lấy thông tin khen thưởng vừa cập nhật
        var updateCommendation = await Commendation.findOne({_id: id}).populate([{path: 'employee', model: Employee}])
        return {...updateCommendation._doc, ...value};
    } else return null 
}