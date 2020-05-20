const EmployeeService = require('./profile.service');
const UserService = require('../../super-admin/user/user.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy thông tin cá nhân theo emailCompany
 */
exports.getEmployeeProfile = async (req, res) => {
    try {
        var inforEmployee = await EmployeeService.getEmployeeProfile(req.params.id);
        console.log(inforEmployee);
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
        var data = await EmployeeService.updatePersonalInformation(req.params.id, req.body, avatar);
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
        var allEmployees = await EmployeeService.searchEmployeeProfiles(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_EMPLOYEE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_list_employee_success"],
            content: allEmployees
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_EMPLOYEE', req.user.company);
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
        console.log(req.files);
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
                        let user = await UserService.createUser(userInfo, req.user.company._id);
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



// Cập nhật thông tin nhân viên
exports.updateEmployeeInformation = async (req, res) => {
    try {
        var data = await EmployeeService.updateEmployeeInformation(req.params.id, req.body);
        res.status(200).json({
            message: "success",
            content: data
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
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