const EmployeeService = require('./profile.service');
const UserService = require('../../super-admin/user/user.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy thông tin cá nhân theo userId
 */
exports.getEmployeeProfile = async (req, res) => {
    try {
        var inforEmployee = await EmployeeService.getEmployeeProfile(req.params.userId);
        await LogInfo(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(200).json({ success: true, messages: ["get_infor_personal_success"], content: inforEmployee});
    } catch (error) {
        await LogError(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(400).json({success: false, messages: ["get_infor_personal_false"], content: {error: error}
        });
    }
}

/**
 * Cập nhật thông tin cá nhân
 */
exports.updatePersonalInformation = async (req, res) => {
    try {
        let avatar = "";
        if (req.file !== undefined) {
            avatar = `/${req.file.path}`;
        }
        var data = await EmployeeService.updatePersonalInformation(req.params.userId, req.body, avatar);
        await LogInfo(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(200).json({success: true, messages: ["edit_infor_personal_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(400).json({ success: false, messages: ["edit_infor_personal_false"], content: {error: error} });
    }
}

/**
 * Lấy danh sách nhân viên
 */
exports.searchEmployeeProfiles = async (req, res) => {
    try {
        let data;
        if(req.query.page === undefined && req.query.limit === undefined ){
            data = await EmployeeService.getEmployees(req.user.company._id, req.query.organizationalUnit, req.query.position, false);
        } else{
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                employeeNumber: req.query.employeeNumber,
                gender: req.query.gender,
                status: req.query.status,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await EmployeeService.searchEmployeeProfiles(params, req.user.company._id);
        }
        await LogInfo(req.user.email, 'GET_EMPLOYEES', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_list_employee_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_EMPLOYEES', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_list_employee_false"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm mới thông tin nhân viên nhân viên
 */
exports.createEmployee = async (req, res) => {
    try {
        let avatar = "";
        if (req.files.fileAvatar !== undefined) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let fileDegree = req.files.fileDegree,
            fileCertificate = req.files.fileCertificate,
            fileContract = req.files.fileContract,
            file = req.files.file;
        let fileInfo = { fileDegree, fileCertificate, fileContract, file, avatar };

        // Kiểm tra dữ liệu truyền vào
        if (req.body.employeeNumber === undefined || req.body.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.emailInCompany === undefined || req.body.emailInCompany.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["email_in_company_required"], content:{ inputData: req.body } });
        } else if(req.body.employeeTimesheetId === undefined || req.body.employeeTimesheetId.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_timesheet_id_required"], content:{ inputData: req.body } });
        } else if(req.body.fullName === undefined || req.body.fullName.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["full_name_required"], content:{ inputData: req.body } });
        } else if(req.body.birthdate === undefined || req.body.birthdate.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["birthdate_required"], content:{ inputData: req.body } });
        } else if(req.body.identityCardNumber === undefined || req.body.identityCardNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_number_required"], content:{ inputData: req.body } });
        } else if(req.body.identityCardDate === undefined || req.body.identityCardDate.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_date_required"], content:{ inputData: req.body } });
        } else if(req.body.identityCardAddress === undefined || req.body.identityCardAddress.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_address_required"], content:{ inputData: req.body } });
        } else if(req.body.phoneNumber === undefined || req.body.phoneNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["phone_number_required"], content:{ inputData: req.body } });
        } else if(req.body.temporaryResidence === undefined || req.body.temporaryResidence.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["temporary_residence_required"], content:{ inputData: req.body } });
        } else if(req.body.taxDateOfIssue === undefined || req.body.taxDateOfIssue.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_date_of_issue_required"], content:{ inputData: req.body } });
        } else if(req.body.taxNumber === undefined || req.body.taxNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_number_required"], content:{ inputData: req.body } });
        } else if(req.body.taxRepresentative === undefined || req.body.taxRepresentative.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_representative_required"], content:{ inputData: req.body } });
        } else if(req.body.taxAuthority === undefined || req.body.taxAuthority.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_authority_required"], content:{ inputData: req.body } });
        } else {
            // Kiểm tra sự tồn tại của mã nhân viên
            let checkMSNV = await EmployeeService.checkEmployeeExisted(req.body.employeeNumber, req.user.company._id );
            if(checkMSNV === true){
                await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                res.status(400).json({ success: false, messages: ["employee_number_have_exist"], content:{ inputData: req.body } });
            } else {
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.body.emailInCompany);
                if(checkEmail === true){
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({ success: false, messages: ["email_in_company_have_exist"], content:{ inputData: req.body } });
                } else {
                    var data = await EmployeeService.createEmployee(req.body, req.user.company._id, fileInfo);
                    let checkUser = await UserService.checkUserExited(req.body.emailInCompany);
                    console.log(checkUser);
                    if(checkUser === false){
                        let userInfo = {
                            email: req.body.emailInCompany,
                            name: req.body.fullName
                        }
                        await UserService.createUser(userInfo, req.user.company._id);
                    }
                    await LogInfo(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(200).json({success: true, messages: ["create_employee_success"], content: data });
                }
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
        res.status(400).json({success: false, messages: ["create_employee_false"], content: { error: error}});
    }
}


/**
 * Cập nhật thông tin nhân viên
 */
exports.updateEmployeeInformation = async (req, res) => {
    try {
        let avatar = "";
        if (req.files.fileAvatar !== undefined) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let fileDegree = req.files.fileDegree,
            fileCertificate = req.files.fileCertificate,
            fileContract = req.files.fileContract,
            file = req.files.file;
        let fileInfo = { fileDegree, fileCertificate, fileContract, file, avatar };
        // Kiểm tra dữ liệu truyền vào
        if (req.body.employee.employeeNumber === undefined || req.body.employee.employeeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_number_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.emailInCompany === undefined || req.body.employee.emailInCompany.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["email_in_company_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.employeeTimesheetId === undefined || req.body.employee.employeeTimesheetId.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_timesheet_id_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.fullName === undefined || req.body.employee.fullName.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["full_name_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.birthdate === undefined || req.body.employee.birthdate.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["birthdate_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.identityCardNumber.toString() === undefined || req.body.employee.identityCardNumber.toString().trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_number_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.identityCardDate === undefined || req.body.employee.identityCardDate.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_date_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.identityCardAddress === undefined || req.body.employee.identityCardAddress.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["identity_card_address_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.phoneNumber.toString() === undefined || req.body.employee.phoneNumber.toString().trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["phone_number_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.temporaryResidence === undefined || req.body.employee.temporaryResidence.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["temporary_residence_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.taxDateOfIssue === undefined || req.body.employee.taxDateOfIssue.trim()==="" ){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_date_of_issue_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.taxNumber.toString() === undefined || req.body.employee.taxNumber.toString().trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_number_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.taxRepresentative === undefined || req.body.employee.taxRepresentative.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_representative_required"], content:{ inputData: req.body } });
        } else if(req.body.employee.taxAuthority === undefined || req.body.employee.taxAuthority.trim()===""){
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({ success: false, messages: ["tax_authority_required"], content:{ inputData: req.body } });
        } else {
            let oldEmployee = await EmployeeService.getEmployeeInforById(req.params.id);
            if(req.body.employee.employeeNumber!==oldEmployee.employeeNumber){
                // Kiểm tra sự tồn tại của mã nhân viên
                let checkMSNV = await EmployeeService.checkEmployeeExisted(req.body.employee.employeeNumber, req.user.company._id );
                if(checkMSNV === true){
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({ success: false, messages: ["employee_number_have_exist"], content:{ inputData: req.body } });
                }
            }
            if(req.body.employee.emailInCompany!==oldEmployee.emailInCompany){
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.body.employee.emailInCompany);
                if(checkEmail === true){
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({ success: false, messages: ["email_in_company_have_exist"], content:{ inputData: req.body } });
                }
            }
            var data = await EmployeeService.updateEmployeeInformation(req.params.id, req.body, fileInfo, req.user.company._id);
            await LogInfo(req.user.email, 'EDIT_EMPLOYEE', req.user.company);
            res.status(200).json({success: true, messages: ["edit_employee_success"], content: data });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_EMPLOYEE', req.user.company);
        res.status(400).json({success: false, messages: ["edit_employee_false"], content: { error: error}});
    }
}

/**
 * Xoá thông tin nhân viên
 */
exports.deleteEmployee = async (req, res) => {
    try {
        var data = await EmployeeService.deleteEmployee(req.params.id);
        res.status(200).json({success: true, messages: ["delete_employee_success"], content: data });
    } catch (error) {
        res.status(400).json({success: false, messages: ["delete_employee_false"], content: { error: error}});
    }
}