const EmployeeService = require('./profile.service');
const UserService = require(`../../super-admin/user/user.service`);
const CompanyServices = require(`../../system-admin/company/company.service`);
const RoleService = require(`../../super-admin/role/role.service`);

const Log = require(`../../../logs`);

/**
 * Lấy thông tin cá nhân của nhân viên theo userId (id người dùng) hoặc emplyeeId (id nhân viên);
 */
exports.getEmployeeProfile = async (req, res) => {
    try {
        let inforEmployee;
        if (req.query.callAPIByUser === "true") { // Theo uerId
            let user = await UserService.getUser(req.portal, req.params.id);
            inforEmployee = await EmployeeService.getEmployeeProfile(req.portal, user.email);
        } else { // Theo employeeId
            let employee = await EmployeeService.getEmployeeInforById(req.portal, req.params.id);
            inforEmployee = await EmployeeService.getEmployeeProfile(req.portal, employee.emailInCompany);
        };
        await Log.info(req.user.email, 'GET_INFOR_PERSONAL', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_infor_personal_success"],
            content: inforEmployee
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_INFOR_PERSONAL', req.portal);
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
        let data = await EmployeeService.updatePersonalInformation(req.portal, req.params.userId, req.body, avatar);
        await Log.info(req.user.email, 'EDIT_INFOR_PERSONAL', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_infor_personal_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_INFOR_PERSONAL', req.portal);
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
                let employee = await EmployeeService.getEmployeeProfile(req.portal, arrEmail[i]);
                data = [...data, employee]
            }
        } else if (req.query.startDate && req.query.endDate) {
            data = await EmployeeService.getEmployeesByStartingAndLeaving(req.portal, req.query.organizationalUnits, req.query.startDate, req.query.endDate, req.user.company._id);
        } else if (req.query.page === undefined && req.query.limit === undefined) {
            data = await EmployeeService.getEmployees(req.portal, req.user.company._id, req.query.organizationalUnits, req.query.position, false, req.query.status);
        } else if(req.query.searchForPackage){
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                professionalSkill: req.query.professionalSkill,
                majors: req.query.majors,
                certificates: req.query.certificates,
                certificatesCount: req.query.certificatesCount,
                certificatesEndDate: req.query.certificatesEndDate,
                package: req.query.package,
                careerPosition: req.query.careerPosition,
                exp: Number(req.query.exp),
                sameExp: Number(req.query.sameExp),
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            listId = await EmployeeService.searchEmployeeForPackage(req.portal, params, req.user.company);

            data = await EmployeeService.getEmployeeInforByListId(req.portal, listId, req.user.company._id, params)
        } else {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                professionalSkills: req.query. professionalSkills,
                careerFields: req.query. careerFields,
                employeeName: req.query.employeeName,
                employeeNumber: req.query.employeeNumber,
                gender: req.query.gender,
                status: req.query.status,
                endDateOfContract: req.query.endDateOfContract,
                birthdate: req.query.birthdate,
                typeOfContract: req.query.typeOfContract,
                certificates: req.query.certificates,
                degrees: req.query.degrees,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await EmployeeService.searchEmployeeProfiles(req.portal, params, req.user.company._id);
        }
        
        await Log.info(req.user.email, 'GET_EMPLOYEES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_employee_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_EMPLOYEES', req.portal);
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
            fileMajor = req.files ? req.files.fileMajor : undefined,
            fileCareer = req.files ? req.files.fileCareer : undefined,
            file = req.files ? req.files.file : undefined,
            healthInsuranceAttachment = req.files ? req.files.healthInsuranceAttachment : undefined;
        let fileInfor = {
            fileDegree,
            fileCertificate,
            fileContract,
            fileMajor,
            fileCareer,
            file,
            avatar,
            healthInsuranceAttachment,
        };

        // Kiểm tra dữ liệu truyền vào
        if (req.body.employeeNumber === undefined || req.body.employeeNumber.trim() === "") {
            throw ["employee_number_required"];
        } else if (req.body.fullName === undefined || req.body.fullName.trim() === "") {
            throw ["full_name_required"]
        } else {
            // Kiểm tra sự tồn tại của mã nhân viên
            let checkMSNV = await EmployeeService.checkEmployeeExisted(req.portal, req.body.employeeNumber, req.user.company._id);
            if (checkMSNV === true) {
                throw ["employee_number_have_exist"];
            } else {
                // Nếu nhân viên không có email thì hệ thống sẽ tự động tạo mail , đảm bảo duy nhất
                let emailInCompany = req.body.emailInCompany;
                if (!emailInCompany) {
                    emailInCompany = `${req.body.employeeNumber}@autocreated.dxclan.com`;
                    req.body = { ...req.body, emailInCompany };
                }
                    
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.portal, emailInCompany);
                if (checkEmail === true) {
                    throw ["email_in_company_have_exist"];
                } else {
                    let data = await EmployeeService.createEmployee(req.portal, req.body, req.user.company._id, fileInfor);
                    if (emailInCompany) {
                        let checkUser = await UserService.checkUserExited(req.portal, emailInCompany);
                        if (checkUser === false) {
                            let userInfo = {
                                email: emailInCompany,
                                name: req.body.fullName
                            }
                            let user = await UserService.createUser(req.portal, userInfo, req.user.company._id);
                            for (let x in req.body.roles) {
                                if(req.body.roles[x])
                                    await RoleService.createRelationshipUserRole(req.portal, user._id, req.body.roles[x])
                            };
                        }
                    }
                    
                    await Log.info(req.user.email, 'CREATE_EMPLOYEE', req.portal);
                    res.status(200).json({
                        success: true,
                        messages: ["create_employee_success"],
                        content: data
                    });
                }
            }
        }
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_EMPLOYEE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ["create_employee_faile"],
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
            fileMajor = req.files ? req.files.fileMajor : undefined,
            fileCareer = req.files ? req.files.fileCareer : undefined,
            file = req.files ? req.files.file : undefined;
        let fileInfor = {
            fileDegree,
            fileCertificate,
            fileMajor,
            fileCareer,
            fileContract,
            file,
            avatar
        };
        // Kiểm tra dữ liệu truyền vào
        if (req.body.employee.employeeNumber === undefined || req.body.employee.employeeNumber.trim() === "") {
            throw ["employee_number_required"];
        }else if (req.body.employee.fullName === undefined || req.body.employee.fullName.trim() === "") {
            throw ["full_name_required"];
        } else {
            let oldEmployee = await EmployeeService.getEmployeeInforById(req.portal, req.params.id);
            if (req.body.employee.employeeNumber !== oldEmployee.employeeNumber) {
                // Kiểm tra sự tồn tại của mã nhân viên
                let checkMSNV = await EmployeeService.checkEmployeeExisted(req.portal, req.body.employee.employeeNumber, req.user.company._id);
                if (checkMSNV === true) {
                    throw ["employee_number_have_exist"]
                }
            }
            if (req.body.employee.emailInCompany && req.body.employee.emailInCompany !== oldEmployee.emailInCompany) {
                // Kiểm tra sự tồn tại của email công ty nhân viên
                let checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.portal, req.body.employee.emailInCompany);
                if (checkEmail === true) {
                    throw ["email_in_company_have_exist"];
                }
            }
            let data = await EmployeeService.updateEmployeeInformation(req.portal, req.params.id, req.body, fileInfor, req.user.company._id);
            
            await Log.info(req.user.email, 'EDIT_EMPLOYEE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_employee_success"],
                content: data
            });
        }
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_EMPLOYEE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ["edit_employee_faile"],
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
        let data = await EmployeeService.deleteEmployee(req.portal, req.params.id);
        if (req.query.emailInCompany)
            await UserService.deleteUserByEmail(req.portal, req.query.emailInCompany);
        
        res.status(200).json({
            success: true,
            messages: ["delete_employee_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error)
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
        if (req.body.importData) {
            req.body.importData = req.body.importData.map(o => {
                if (!o.emailInCompany) {
                    o.emailInCompany = `${o.employeeNumber}@autocreated.dxclan.com`.toLowerCase();
                }
                return o;
            })  
        }

        if (req.body.importType === 'Employee_Infor') {
            data = await
                EmployeeService.importEmployeeInfor(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Update_Employee_Infor') {
            data = await EmployeeService.importUpdateEmployeeInfor(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Experience') {
            data = await EmployeeService.importExperience(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'WorkProcess') {
            data = await EmployeeService.importWorkProcess(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Degree') {
            data = await EmployeeService.importDegree(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Certificate') {
            data = await EmployeeService.importCertificate(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'Contract') {
            data = await EmployeeService.importContract(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'SocialInsuranceDetails') {
            data = await EmployeeService.importSocialInsuranceDetails(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'File') {
            data = await EmployeeService.importFile(req.portal, req.user.company._id, req.body.importData);
        };
        if (req.body.importType === 'FamilyMembers') {
            data = await EmployeeService.importFamily(req.portal, req.user.company._id, req.body.importData);
        };

        if (data?.errorStatus === true) {
            await Log.error(req.user.email, 'IMPORT_EMPLOYEE', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_employee_faile"],
                content: data
            });
        } else {
            if (req.body.importType === 'Employee_Infor') {
                let users = await UserService.getUsers(req.portal, req.user.company._id, req.query);
                let newUsers = data;
                // lọc trong danh sach import những người nào có email ko trùng trong bảng user trên hệ thông
                newUsers = newUsers.filter(x => !users.some(y => y.email === x.emailInCompany));

                for (let x of newUsers) {
                    // Nếu nhân viên nào đó có email thì tạo user. Không có thì bỏ qua
                    if (x.emailInCompany) {
                        let checkUser = await UserService.checkUserExited(req.portal, x.emailInCompany);
                        if (checkUser === false) {
                            let userInfo = {
                                email: x.emailInCompany,
                                name: x.fullName
                            }
                            const userCreated = await UserService.createUser(req.portal, userInfo, req.user.company._id);
                            // import roles nhân viên
                            const importDataLength = req.body.importData.length;
                            let importData = req.body.importData;
                            for (let i = 0; i < importDataLength; i++){
                                if (importData[i].positionId && importData[i].positionId.length > 0 && importData[i].employeeNumber.toString() === x.employeeNumber.toString()) {
                                    for (let k in importData[i].positionId) {
                                        if(importData[i].positionId[k])
                                            await RoleService.createRelationshipUserRole(req.portal, userCreated._id, importData[i].positionId[k])
                                    };
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            await Log.info(req.user.email, 'IMPORT_EMPLOYEE', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_employee_success"],
                content: data
            });
        }
    } catch (error) {
        console.log('error', error)
        await Log.error(req.user.email, 'IMPORT_EMPLOYEE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_employee_faile"],
            content: {
                error: error
            }
        });
    }
}


exports.createNotificationEndOfContract = async () => {
    let companys = await CompanyServices.getAllCompanies({
        page: undefined,
        limit: undefined
    });
    companys = companys.map(x => x.shortName);
    for (let n in companys) {
        await EmployeeService.createNotificationEndOfContract(companys[n]);
    }
};

exports.createNotificationForEmployeesHaveBrithdayCurrent = async () => {
    let companys = await CompanyServices.getAllCompanies({
        page: undefined,
        limit: undefined
    });
    companys = companys.map(x => x.shortName);
    for (let n in companys) {
        await EmployeeService.createNotificationForEmployeesHaveBrithdayCurrent(companys[n]);
    }
}


/**
 * Lấy danh sách nhân viên
 */
exports.searchEmployeeForPackage = async (req, res) => {
    try {
        let data;
        
        await Log.info(req.user.email, 'GET_EMPLOYEES_FOR_BIDDING_PACKAGE', req.portal);
        console.log("package", req.query.package)
        if (req.query.package) {
            data = await EmployeeService.getEmployeeByPackageId(req.portal, req.query.package, req.user.company._id)
        }
        console.log("data2", data)

        res.status(200).json({
            success: true,
            messages: ["search_for_package_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_EMPLOYEES_FOR_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["search_for_package_faile"],
            content: {
                error: error
            }
        });
    }
}


exports.getEmployeesByPackage = async (req, res) => {
    try {
        let data;
        data = await EmployeeService.getEmployeeByPackageId(req.portal, params.packageId? params.packageId : '1' , req.user.company._id);

        await Log.info(req.user.email, 'GET_EMPLOYEES_BY_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_employee_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_EMPLOYEES_BY_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_list_employee_faile"],
            content: {
                error: error
            }
        });
    }
}