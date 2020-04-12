const Salary = require('../../../models/salary.model');
const Employee = require('../../../models/employee.model');
const EmployeeService = require('../employee/employee.service');

// Lấy danh sách các bẳng lương của nhân viên
exports.get = async (data, company) => {
    var keySearchEmployee, keySearch = { company: company};
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
        var employeeInfo = await Employee.find(keySearchEmployee);
        var employee = employeeInfo.map(x => x._id);
        keySearch = { ...keySearch, employee: { $in: employee }}
    }
    //Bắt sựu kiện MSNV tìm kiếm khác ""
    if (data.month !== "") {
        keySearch = {...keySearch, month: data.month}
    };
    // Lấy danh sách bảng lương
    var totalList = await Salary.count(keySearch);
    var listSalary = await Salary.find(keySearch).populate({ path: 'employee', model: Employee})
        .sort({ 'createDate': 'desc' }).skip(data.page).limit(data.limit);
    for (let n in listSalary) {
        let value = await EmployeeService.getUnitAndPositionEmployee(listSalary[n].employee.emailCompany);
        listSalary[n] = {...listSalary[n]._doc, ...value}
    }
    return {totalList, listSalary}
}

// Thêm mới bẳng lương mới
exports.create = async (data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company: company}, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        var isSalary = await Salary.findOne({employee: employeeInfo._id, company: company, month: data.month}, {field1: 1});
        if (isSalary !== null) {
            return "have_exist"
        } else {
            let salary = data.mainSalary + data.unit;
            // Thêm bảng lương vào database
            let createSalary = await Salary.create({
                employee: employeeInfo._id,
                company: company,
                month: data.month,
                mainSalary: salary,
                bonus: data.bonus
            });
            // Lấy thông tin phòng ban, chức vụ của nhân viên
            let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
            //Lấy thông tin bảng lương vừa tạo
            var newSalary = await Salary.findOne({ _id: createSalary._id }).populate([{ path: 'employee', model: Employee }])
            return {...newSalary._doc, ...value}
        }
        
    } else return null
}

// Xoá bẳng lương
exports.delete = async (id) => {
    return await Salary.findOneAndDelete({ _id: id });
}

// Chỉnh sửa thông tin bảng lương
exports.update = async (id, data, company) => {
    // Lấy thông tin nhân viên
    let employeeInfo = await Employee.findOne({ employeeNumber: data.employeeNumber, company:company }, { _id: 1, emailCompany: 1});
    if(employeeInfo!==null){
        let salaryChange = {
            employee: employeeInfo._id,
            month: data.month,
            mainSalary: data.unit ? (data.mainSalary + data.unit) : data.mainSalary,
            bonus: data.bonus,
            updateDate: Date.now()
        };
        // Cập nhật thông tin bảng lương vào database
        await Salary.findOneAndUpdate({ _id: id }, { $set: salaryChange });
        // Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
        let value = await EmployeeService.getUnitAndPositionEmployee(employeeInfo.emailCompany);
        // Lấy thông tin bảng lương vừa cập nhật
        var updateSalary = await Salary.findOne({ _id: id }).populate([{ path: 'employee', model: Employee }])
        return {...updateSalary._doc, ...value}
    } else return null
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
exports.checkSalary = async (employeeNumber,month, company) => {
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
exports.checkArraySalary = async (data, company) => {
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
exports.importSalary = async (data, company) => {
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