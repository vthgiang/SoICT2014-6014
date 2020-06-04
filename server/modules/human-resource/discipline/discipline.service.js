const { Discipline, Employee } = require('../../../models').schema;

const EmployeeService = require('../profile/profile.service');

/**
 * Lấy tổng số thông tin khen thường theo đơn vị (phòng ban) và tháng 
 * @company : id công ty
 * @organizationalUnits : array id đơn vị tìm kiếm
 * @month : tháng tìm kiếm
 */
exports.getTotalDiscipline = async (company, organizationalUnits, month)=>{
    let keySearchEmployee, keySearch = {company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (organizationalUnits !== undefined) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(organizationalUnits, undefined);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id);
        keySearch = {...keySearch, employee: {$in: employee}}
    }

    //Bắt sựu kiện tháng tìm kiếm khác "", undefined
    if (month !== undefined && month.length !== 0) {
        var date = new Date(month);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        keySearch = {...keySearch, startDate: {"$gt": firstDay, "$lte": lastDay}}
    };
    var totalList = await Discipline.count(keySearch);
    return {totalList};
}


/**
 * Lấy danh sách kỷ luật của nhân viên
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */ 
exports.searchDisciplines = async (params, company) => {
    var keySearchEmployee, keySearch = { company: company};
    
    // Bắt sựu kiện đơn vị tìm kiếm khác undefined 
    if (params.organizationalUnits !== undefined) {
        let emailInCompany =await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnits, params.position);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }
    
    // Bắt sựu kiện MSNV tìm kiếm khác "", undefined
    if (params.employeeNumber !== undefined && params.employeeNumber.length !==0 ) {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: params.employeeNumber, $options: "i"}}
    }
    if (keySearchEmployee !== undefined) {
        var employeeinfo = await Employee.find(keySearchEmployee);
        var employee = employeeinfo.map(employeeinfo => employeeinfo._id); 
            keySearch = {...keySearch, employee: { $in: employee}}
    }
    
    // Bắt sựu kiện số quyết định tìm kiếm khác "", undefined
    if (params.decisionNumber !== undefined && params.decisionNumber.length !== 0) {
        keySearch = {...keySearch, decisionNumber: {$regex: params.decisionNumber, $options: "i"}}
    };
    
    // Lấy danh sách kỷ luật
    var totalList = await Discipline.count(keySearch);
    var listDisciplines = await Discipline.find(keySearch).populate({path: 'employee', model: Employee})
        .sort({'createDate': 'desc'}).skip(params.page).limit(params.limit);
    for (let n in listDisciplines) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listDisciplines[n].employee.emailInCompany);
        listDisciplines[n] = {...listDisciplines[n]._doc, ...value}
    }
    
    return {totalList, listDisciplines}
}
/**
 * Thêm mới kỷ luật
 * @data: dữ liệu kỷ luật cần tạo
 * @company: Id công ty người tạo
 */
exports.createDiscipline = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailInCompany: 1});
    if(employeeInfo!==null){
        var isDiscipline = await Discipline.findOne({employee: employeeInfo._id, company: company, decisionNumber: data.decisionNumber}, {field1: 1});
        if (isDiscipline !== null){
            return "have_exist"
        } else {
            // Thêm kỷ luật vào database
            var partStart = data.startDate.split('-');
            var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
            var partEnd = data.endDate.split('-');
            var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
            var createDiscipline = await Discipline.create({
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
            
            //Lấy thông tin kỷ luật vừa tạo
            let newDiscipline = await Discipline.findOne({_id: createDiscipline._id}).populate([{path: 'employee', model: Employee}]);
            
            return {...newDiscipline._doc, ...value}
        }
    } else return null;
}

/**
 *  Xoá thông tin kỷ luật
 * @id: Id kỷ luật cần xoá
 */
exports.deleteDiscipline = async (id) => {
    return await Discipline.findOneAndDelete({_id: id});
}

/**
 * Chỉnh sửa thông tin kỷ luật
 * @id: Id kỷ luật cần chỉnh sửa
 * @data: Dữ liệu chỉnh sửa kỷ luật
 * @company: Id công ty người chỉnh sửa
 */
exports.updateDiscipline = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailInCompany: 1});
    if(employeeInfo!==null){
        var partStart = data.startDate.split('-');
        var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        var partEnd = data.endDate.split('-');
        var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
        let DisciplineChange = {
            organizationalUnit: data.organizationalUnit,
            startDate: startDate,
            endDate: endDate,
            type: data.type,
            reason: data.reason,
        };

        // Cập nhật thông tin kỷ luật vào database
        await Discipline.findOneAndUpdate({_id: id}, {$set: DisciplineChange});
        
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
        
        // Lấy thông tin kỷ luật vừa cập nhật
        var updateDiscipline = await Discipline.findOne({_id: id}).populate([{path: 'employee', model: Employee}]);
        
        return {...updateDiscipline._doc, ...value}
    } else return null
}