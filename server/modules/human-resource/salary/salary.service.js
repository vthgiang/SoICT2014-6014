const EmployeeService = require('../profile/profile.service');
const { Employee, Salary } = require('../../../models').schema;

/**
 * Lấy danh sách các bảng lương của nhân viên
 * @params : dữ liệu các key tìm kiếm
 * @company : id công ty người tìm kiếm
 */
exports.searchSalaries = async (params, company) => {
    var keySearchEmployee, keySearch = { company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác null 
    if (params.organizationalUnit !== undefined) {
        let emailInCompany = await EmployeeService.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnit, params.position);
        keySearchEmployee = {...keySearchEmployee, emailInCompany: {$in: emailInCompany}}
    }

    // Bắt sựu kiện MSNV tìm kiếm khác ""
    if (params.employeeNumber !== undefined && params.employeeNumber.length !==0) {
        keySearchEmployee = {...keySearchEmployee, employeeNumber: {$regex: params.employeeNumber, $options: "i"}}
    }

    if (keySearchEmployee !== undefined) {
        var employeeInfo = await Employee.find(keySearchEmployee);
        var employee = employeeInfo.map(x => x._id);
        keySearch = { ...keySearch, employee: { $in: employee }}
    }

    //Bắt sựu kiện tháng tìm kiếm khác null
    if (params.month !== undefined && params.month.length !== 0) {
        keySearch = {...keySearch, month: new Date(params.month)}
    };

    // Lấy danh sách bảng lương
    var totalList = await Salary.count(keySearch);
    var listSalarys = await Salary.find(keySearch).populate({ path: 'employee', model: Employee})
        .sort({ 'createDate': 'desc' }).skip(params.page).limit(params.limit);

    for (let n in listSalarys) {
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(listSalarys[n].employee.emailInCompany);
        listSalarys[n] = {...listSalarys[n]._doc, ...value}
    }

    return {totalList, listSalarys}
}

/**
 *  Thêm mới bảng lương mới 
 *  @data: dữ liệu bảng lương
 *  @company: id công ty người thêm
 */
exports.createSalary = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailInCompany: 1});
    let month = new Date(data.month);
    if(employeeInfo!==null){
        let isSalary = await Salary.findOne({employee: employeeInfo._id, company: company, month: month }, {field1: 1});
        if (isSalary !== null) {
            return "have_exist"
        } else {
            // Thêm bảng lương vào database
            let createSalary = await Salary.create({
                employee: employeeInfo._id,
                company: company,
                month: month,
                mainSalary: data.mainSalary,
                unit: data.unit,
                bonus: data.bonus
            });
            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
            // Lấy thông tin bảng lương vừa tạo
            let newSalary = await Salary.findOne({ _id: createSalary._id }).populate([{ path: 'employee', model: Employee }])
            return {...newSalary._doc, ...value}
        }
        
    } else return null
}

/**
 * Xoá bẳng lương
 * @id: id bảng lương
 */ 
exports.deleteSalary = async (id) => {
    return await Salary.findOneAndDelete({ _id: id });
}

/**
 * Chỉnh sửa thông tin bảng lương
 * @id: id bảng lương muốn chỉnh sửa
 * @data: dữ liệu thay đổi
 * @company: id công ty người thay đổi
 */
exports.updateSalary = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company }, { _id: 1, emailInCompany: 1});
    if(employeeInfo!==null){
        let salaryChange = {
            mainSalary: data.mainSalary,
            unit:data.unit,
            bonus: data.bonus,
        };
        // Cập nhật thông tin bảng lương vào database
        await Salary.findOneAndUpdate({ _id: id }, { $set: salaryChange });

        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getAllPositionRolesAndOrganizationalUnitsOfUser(employeeInfo.emailInCompany);
        
        // Lấy thông tin bảng lương vừa cập nhật
        var updateSalary = await Salary.findOne({ _id: id }).populate([{ path: 'employee', model: Employee }])
        
        return {...updateSalary._doc, ...value}

    } else return null
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
exports.checkSalaryExisted = async (employeeNumber,month, company) => {
    var employeeInfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company:company
    });
    var idSalary = await Salary.find({
        employee: employeeInfo._id,
        company: company,
        month:month
    }, {field1: 1})
    var checkSalary = false;
    if (idSalary.length !== 0) {
        checkSalary = true
    }
    return checkSalary;
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
exports.checkSalariesExisted = async (data, company) => {
    var list=[];
    for(let i=0; i<data.arraySalary.length; i++){
        let employeeInfo = await Employee.findOne({
            employeeNumber: data.arraySalary[i].employeeNumber,
            company:company
        },{
            field1: 1
        });
        if(employeeInfo!==null){
            let salary=await Salary.findOne({
                employee:employeeInfo._id,
                company: company,
                month:data.arraySalary[i].month
            }, {
                field1: 1
            })
            if(salary!==null){
                list.push(i);
            }
        }
    }
    return list;
}

// Import dữ liệu bảng lương
exports.importSalaries = async (data, company) => {
    var importSalary=[];
    for(let n in data.rows){
        var row = data.rows[n];
        var employeeInfo = await Employee.findOne({
            employeeNumber: row[3],
            company: company
        });
        var mainSalary = row[5].toString();
        unit = mainSalary.slice(mainSalary.length-3,mainSalary.length);
        if( unit !== "VND" && unit !== "USD"){
            mainSalary = mainSalary + "VND"
        }
        var month = "",bonus=[];
            if (row[1].toString().length === 2) {
                month = row[1].toString() + "-" + row[2].toString();
            } else {
                month = "0" + row[1].toString() + "-" + row[2].toString();
            }
            for(let i=6;i<row.length;i++){
                if(row[i]!==null){
                    bonus=[...bonus,{
                        nameBonus:data.cols[i],
                        number:row[i]
                    }]
                }
            }
        var newSalary = await Salary.create({
            employee: employeeInfo._id,
            company: company,
            month: month,
            mainSalary: mainSalary,
            bonus: bonus
        });
        importSalary[n]=newSalary;
    }
    return importSalary;
}