const EmployeeService = require('./profile.service');
const UserService = require('../../super-admin/user/user.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Lấy thông tin cá nhân của nhân viên theo userId (id người dùng) hoặc emplyeeId (id nhân viên);
 */
exports.getEmployeeProfile = async (req, res) => {
    try {
        let inforEmployee;
        if (req.query.callAPIByUser === "true") { // Theo uerId
            let user = await UserService.getUser(req.params.id);
            inforEmployee = await EmployeeService.getEmployeeProfile(user.email);
        } else { // Theo employeeId
            let employee = await EmployeeService.getEmployeeInforById(req.params.id);
            inforEmployee = await EmployeeService.getEmployeeProfile(employee.emailInCompany);
        };
        await LogInfo(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["get_infor_personal_success"],
            content: inforEmployee
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["get_infor_personal_faile"],
            content: {
                error: error
            }
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
        res.status(200).json({
            success: true,
            messages: ["edit_infor_personal_success"],
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["edit_infor_personal_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Lấy danh sách nhân viên
 */
exports.searchEmployeeProfiles = async (req, res) => {
    try {
        let data;
        if (req.query.exportData) {
            let arrEmail = req.query.arrEmail;
            data = [];
            for (let i = 0; i < arrEmail.length; i++) {
                let employee = await EmployeeService.getEmployeeProfile(arrEmail[i]);
                data = [...data, employee]
            }
        } else if (req.query.numberMonth) {
            data = await EmployeeService.getEmployeesOfNumberMonth(req.query.organizationalUnits, req.query.numberMonth, req.user.company._id);
        } else if (req.query.page === undefined && req.query.limit === undefined) {
            data = await EmployeeService.getEmployees(req.user.company._id, req.query.organizationalUnits, req.query.position, false, req.query.status);
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                employeeNumber: req.query.employeeNumber,
                gender: req.query.gender,
                status: req.query.status,
                endDateOfContract: req.query.endDateOfContract,
                birthdate: req.query.birthdate,
                typeOfContract: req.query.typeOfContract,
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
            messages: ["get_list_employee_faile"],
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
        if (req.files && req.files.fileAvatar !== undefined) {
            let fileAvatar = req.files.fileAvatar[0];
            if (fileAvatar.path) {
                let path = fileAvatar.path;
                let regex = /\\/gi;
                avatar = `/${path.replace(regex, '/')}`;
            }

        }
        let fileDegree = req.files ? req.files.fileDegree : undefined,
            fileCertificate = req.files ? req.files.fileCertificate : undefined,
            fileContract = req.files ? req.files.fileContract : undefined,
            file = req.files ? req.files.file : undefined;
        let fileInfor = {
            fileDegree,
            fileCertificate,
            fileContract,
            file,
            avatar
        };

        // Kiểm tra dữ liệu truyền vào
        if (req.body.employeeNumber === undefined || req.body.employeeNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.emailInCompany === undefined || req.body.emailInCompany.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["email_in_company_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employeeTimesheetId === undefined || req.body.employeeTimesheetId.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_timesheet_id_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.fullName === undefined || req.body.fullName.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["full_name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.birthdate === undefined || req.body.birthdate.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["birthdate_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.identityCardNumber === undefined || req.body.identityCardNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.identityCardDate === undefined || req.body.identityCardDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.identityCardAddress === undefined || req.body.identityCardAddress.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_address_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.phoneNumber === undefined || req.body.phoneNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["phone_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.temporaryResidence === undefined || req.body.temporaryResidence.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["temporary_residence_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            // Kiểm tra sự tồn tại của mã nhân viên
            let checkMSNV = await EmployeeService.checkEmployeeExisted(req.body.employeeNumber, req.user.company._id);
            if (checkMSNV === true) {
                await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                res.status(400).json({
                    success: false,
                    messages: ["employee_number_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.body.emailInCompany);
                if (checkEmail === true) {
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({
                        success: false,
                        messages: ["email_in_company_have_exist"],
                        content: {
                            inputData: req.body
                        }
                    });
                } else {
                    var data = await EmployeeService.createEmployee(req.body, req.user.company._id, fileInfor);
                    let checkUser = await UserService.checkUserExited(req.body.emailInCompany);
                    if (checkUser === false) {
                        let userInfo = {
                            email: req.body.emailInCompany,
                            name: req.body.fullName
                        }
                        await UserService.createUser(userInfo, req.user.company._id);
                    }
                    await LogInfo(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(200).json({
                        success: true,
                        messages: ["create_employee_success"],
                        content: data
                    });
                }
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["create_employee_faile"],
            content: {
                error: error
            }
        });
    }
}


/**
 * Cập nhật thông tin nhân viên
 */
exports.updateEmployeeInformation = async (req, res) => {
    try {
        let avatar = "";
        if (req.files && req.files.fileAvatar !== undefined) {
            let fileAvatar = req.files.fileAvatar[0]
            if (fileAvatar.path) {
                let path = fileAvatar.path;
                let regex = /\\/gi;
                avatar = `/${path.replace(regex, '/')}`;
            }
        }

        let fileDegree = req.files ? req.files.fileDegree : undefined,
            fileCertificate = req.files ? req.files.fileCertificate : undefined,
            fileContract = req.files ? req.files.fileContract : undefined,
            file = req.files ? req.files.file : undefined;
        let fileInfor = {
            fileDegree,
            fileCertificate,
            fileContract,
            file,
            avatar
        };
        // Kiểm tra dữ liệu truyền vào
        if (req.body.employee.employeeNumber === undefined || req.body.employee.employeeNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.emailInCompany === undefined || req.body.employee.emailInCompany.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["email_in_company_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.employeeTimesheetId === undefined || req.body.employee.employeeTimesheetId.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["employee_timesheet_id_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.fullName === undefined || req.body.employee.fullName.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["full_name_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.birthdate === undefined || req.body.employee.birthdate.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["birthdate_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.identityCardNumber.toString() === undefined || req.body.employee.identityCardNumber.toString().trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.identityCardDate === undefined || req.body.employee.identityCardDate.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_date_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.identityCardAddress === undefined || req.body.employee.identityCardAddress.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["identity_card_address_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.phoneNumber.toString() === undefined || req.body.employee.phoneNumber.toString().trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["phone_number_required"],
                content: {
                    inputData: req.body
                }
            });
        } else if (req.body.employee.temporaryResidence === undefined || req.body.employee.temporaryResidence.trim() === "") {
            await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["temporary_residence_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let oldEmployee = await EmployeeService.getEmployeeInforById(req.params.id);
            if (req.body.employee.employeeNumber !== oldEmployee.employeeNumber) {
                // Kiểm tra sự tồn tại của mã nhân viên
                let checkMSNV = await EmployeeService.checkEmployeeExisted(req.body.employee.employeeNumber, req.user.company._id);
                if (checkMSNV === true) {
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({
                        success: false,
                        messages: ["employee_number_have_exist"],
                        content: {
                            inputData: req.body
                        }
                    });
                }
            }
            if (req.body.employee.emailInCompany !== oldEmployee.emailInCompany) {
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.body.employee.emailInCompany);
                if (checkEmail === true) {
                    await LogError(req.user.email, 'CREATE_EMPLOYEE', req.user.company);
                    res.status(400).json({
                        success: false,
                        messages: ["email_in_company_have_exist"],
                        content: {
                            inputData: req.body
                        }
                    });
                }
            }
            var data = await EmployeeService.updateEmployeeInformation(req.params.id, req.body, fileInfor, req.user.company._id);
            await LogInfo(req.user.email, 'EDIT_EMPLOYEE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_employee_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_EMPLOYEE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["edit_employee_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Xoá thông tin nhân viên
 */
exports.deleteEmployee = async (req, res) => {
    try {
        var data = await EmployeeService.deleteEmployee(req.params.id);
        res.status(200).json({
            success: true,
            messages: ["delete_employee_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_employee_faile"],
            content: {
                error: error
            }
        });
    }
}

/**
 * import thông tin nhân viên
 */
exports.importEmployees = async (req, res) => {
    try {
        let data;
        if (req.body.importType === 'Employee_Infor') {
            data = await EmployeeService.importEmployeeInfor(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Experience') {
            data = await EmployeeService.importExperience(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Degree') {
            data = await EmployeeService.importDegree(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Certificate') {
            data = await EmployeeService.importCertificate(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Contract') {
            data = await EmployeeService.importContract(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'SocialInsuranceDetails') {
            data = await EmployeeService.importSocialInsuranceDetails(req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'File') {
            data = await EmployeeService.importFile(req.user.company._id, req.body.importData);
        };
        if (data.errorStatus === true) {
            await LogError(req.user.email, 'IMPORT_EMPLOYEE', req.user.company);
            res.status(400).json({
                success: false,
                messages: ["import_employee_faile"],
                content: data
            });
        } else {
            if (req.body.importType === 'Employee_Infor') {
                let users = await UserService.getUsers(req.user.company._id, req.query);
                let newUsers = data;
                newUsers = newUsers.filter(x => !users.some(y => y.email === x.emailInCompany));
                for (let x of newUsers) {
                    let checkUser = await UserService.checkUserExited(x.emailInCompany);
                    if (checkUser === false) {
                        let userInfo = {
                            email: x.emailInCompany,
                            name: x.fullName
                        }
                        await UserService.createUser(userInfo, req.user.company._id);
                    }
                }
            }
            await LogInfo(req.user.email, 'IMPORT_EMPLOYEE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["import_employee_success"],
                content: data
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'IMPORT_EMPLOYEE', req.user.company);
        res.status(400).json({
            success: false,
            messages: ["import_employee_faile"],
            content: {
                error: error
            }
        });
    }
}