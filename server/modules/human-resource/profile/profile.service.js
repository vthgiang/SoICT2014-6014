const { 
    Employee,
    Discipline,
    Commendation,
    AnnualLeave,
    Salary,
    OrganizationalUnit,
    UserRole,
    User,
    Role
} = require('../../../models').schema;

/**
 * Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
 * @emailInCompany: email công ty của nhân viên
 */
exports.getAllPositionRolesAndOrganizationalUnitsOfUser = async (emailInCompany)=>{
    let roles = [], organizationalUnits = [];
    let user = await User.findOne({email: emailInCompany},{ _id:1 })
    if (user !== null) {
        roles = await UserRole.find({ userId: user._id }).populate([{ path: 'roleId', model: Role }]);
        let newRoles = roles.map(role => role.roleId._id);
        organizationalUnits = await OrganizationalUnit.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'viceDean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ] 
        });
    }
    if (roles !== []) {
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
    }
    
    return { roles, organizationalUnits }
    // TODO: Còn có role tự tạo, cần loại bỏ Root roles và Company-Defined roles
}

/**
 * Lấy danh sách email công ty theo phòng ban và chức vụ
 * @organizationalUnits: mảng id phòng ban
 * @position: mảng id chức vụ(role)
 */
exports.getEmployeeEmailsByOrganizationalUnitsAndPositions = async(organizationalUnits, position)=>{
    let units = [], roles = [];
    for(let n in organizationalUnits){
        // Lấy thông tin đơn vị
        let unitInfo = await OrganizationalUnit.findById(organizationalUnits[n]);  
        units = [...units, unitInfo]
    }
    if (position === null) {
        units.forEach(u => {
            let role = [u.dean, u.viceDean, u.employee]; 
            roles = roles.concat(role); 
        })
    } else {
        roles = position
    }

    // Lấy danh sách người dùng theo phòng ban và chức danh
    let userRoles = await UserRole.find({roleId: {$in: roles}});

    // Lấy userID vào 1 arr
    let userId = userRoles.map(userRole => userRole.userId); 

    // Lấy email của người dùng theo phòng ban và chức danh
    var emailUsers = await User.find({_id: {$in: userId}}, {email: 1});
    
    return emailUsers.map(user => user.email)
}

/**
 * Lấy thông tin cá nhân của nhân viên
 * @email: email công ty của nhân viên
 */ 
exports.getEmployeeProfile = async (email) => {
    
    let employees = await Employee.find({
        emailInCompany: email
    });
    if(employees.length === 0){
        return { employees: employees}
    } else {
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(email);
        let salarys = await Salary.find({
            employee: employees[0]._id
        })
        let annualLeaves = await AnnualLeave.find({
            employee: employees[0]._id
        })
        let commendations = await Commendation.find({
            employee: employees[0]._id
        })
        let disciplines = await Discipline.find({
            employee: employees[0]._id
        })
        return { employees: employees, salarys, annualLeaves, commendations, disciplines, ...value}
    }
    
}
/**
 * Cập nhật thông tin cá nhân của nhân viên
 * @eamil: email công ty của nhân viên 
 * @data: dữ liệu chỉnh sửa thông tin của nhân viên
 */
exports.updatePersonalInformation = async (email, data, avatar) => {
    if(avatar===""){
        avatar=data.avatar;
    }
    var employeeInfo = await Employee.findOne({emailInCompany: email}, { _id: 1});
    // Thông tin cần cập nhật 
    var employeeUpdate = {
        avatar: avatar,
        gender: data.gender,
        ethnic: data.ethnic,
        religion: data.religion,
        nationality: data.nationality,
        maritalStatus: data.maritalStatus,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.phoneNumber2,
        personalEmail: data.personalEmail,
        personalEmail2: data.personalEmail2,
        homePhone: data.homePhone,
        emergencyContactPerson: data.emergencyContactPerson,
        relationWithEmergencyContactPerson: data.relationWithEmergencyContactPerson,
        emergencyContactPersonPhoneNumber: data.emergencyContactPersonPhoneNumber,
        emergencyContactPersonEmail: data.emergencyContactPersonEmail,
        emergencyContactPersonHomePhone: data.emergencyContactPersonHomePhone,
        emergencyContactPersonAddress: data.emergencyContactPersonAddress,
        permanentResidence: data.permanentResidence,
        permanentResidenceCountry: data.permanentResidenceCountry,
        permanentResidenceCity: data.permanentResidenceCity,
        permanentResidenceDistrict: data.permanentResidenceDistrict,
        permanentResidenceWard: data.permanentResidenceWard,
        temporaryResidence: data.temporaryResidence,
        temporaryResidenceCountry: data.temporaryResidenceCountry,
        temporaryResidenceCity: data.temporaryResidenceCity,
        temporaryResidenceDistrict: data.temporaryResidenceDistrict,
        temporaryResidenceWard: data.temporaryResidenceWard,
    }
    // Cập nhật thông tin cơ bản vào database
    await Employee.findOneAndUpdate({_id: employeeInfo._id}, {$set: employeeUpdate});
    
    return await Employee.find({_id: employeeInfo._id});
}

/**
 * Lấy danh sách nhân viên
 * @data: dữ liệu key tìm kiếm
 * @company: Id công ty người tìm kiếm
 */ 
exports.searchEmployeeProfiles = async (data, company) => {
    var keySearch = {company: company};

    // Bắt sựu kiện đơn vị tìm kiếm khác null
    if (data.organizationalUnit !== null) {
        let emailInCompany = await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(data.organizationalUnit, data.position);
        keySearch = {...keySearch, emailInCompany: {$in: emailInCompany}}
    }

    // Bắt sựu kiện MSNV tìm kiếm khác ""
    if (data.employeeNumber !== "") {
        keySearch = {...keySearch, employeeNumber: {$regex: data.employeeNumber, $options: "i"}}
    };

    // Bắt sựu kiện MSNV tìm kiếm khác "Null"
    if (data.gender !== null) {
        keySearch = {...keySearch, gender: {$in: data.gender}};
    };

    // Thêm key tìm kiếm nhân viên theo trạng thái hoạt động vào keySearch
    if (data.status !== null) {
        keySearch = {...keySearch, status: {$in: data.status}};
    };
    
    // Lấy danh sách nhân viên
    var totalList = await Employee.count(keySearch);
    var listEmployees = await Employee.find(keySearch, {field1: 1, emailInCompany: 1})
    .sort({'createdAt': 'desc'}).skip(data.page).limit(data.limit);
    var data = [];
    for (let n in listEmployees) {
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(listEmployees[n].emailInCompany);
        var employees = await Employee.find({_id: listEmployees[n]._id});
        var salarys = await Salary.find({employee: listEmployees[n]._id})
        var annualLeaves = await AnnualLeave.find({employee: listEmployees[n]._id})
        var commendations = await Commendation.find({employee: listEmployees[n]._id})
        var disciplines = await Discipline.find({employee: listEmployees[n]._id})
        data[n] = {employees, salarys, annualLeaves, commendations, disciplines, ...value}
    }

    return { data, totalList}
}


/**
 * Thêm mới nhân viên
 * @data : Dữ liệu thông tin nhân viên
 * @company : Id công ty
 * @fileInfo : Thông tin file đính kèm
 */
// 
exports.createEmployee = async (data, company, fileInfo) => {
    let avatar = fileInfo.avatar==="" ? data.avatar : fileInfo.avatar,
        fileDegree = fileInfo.fileDegree, fileCertificate = fileInfo.fileCertificate,
        fileContract = fileInfo.fileContract, file = fileInfo.file;
        degrees = data.degrees, certificates = data.certificates, contracts = data.contracts,
        files = data.files;
        if(fileDegree !== undefined){
            degrees.forEach(x=>{
                fileDegree.forEach(y=>{
                    if(x.file===y.originalname){
                        x.urlFile = `/${y.path}`;
                    }
                })
            })
        }
        if(fileCertificate !== undefined){
            certificates.forEach(x=>{
                fileCertificate.forEach(y=>{
                    if(x.file===y.originalname){
                        x.urlFile = `/${y.path}`;
                    }
                })
            })
        }
        if(fileContract !== undefined){
            contracts.forEach(x=>{
                fileContract.forEach(y=>{
                    if(x.file===y.originalname){
                        x.urlFile = `/${y.path}`;
                    }
                })
            })
        }
        if(fileContract !== undefined){
            files.forEach(x=>{
                file.forEach(y=>{
                    if(x.file===y.originalname){
                        x.urlFile = `/${y.path}`;
                    }
                })
            })
        }
    var createEmployee = await Employee.create({
        avatar: avatar,
        fullName: data.fullName,
        employeeNumber: data.employeeNumber,
        employeeTimesheetId: data.employeeTimesheetId,
        company: company,
        gender: data.gender,
        birthdate: data.birthdate,
        birthplace: data.birthplace,
        identityCardNumber: data.identityCardNumber,
        identityCardDate: data.identityCardDate,
        identityCardAddress: data.identityCardAddress,
        emailInCompany: data.emailInCompany,
        taxNumber: data.taxNumber,
        taxRepresentative: data.taxRepresentative,
        taxDateOfIssue: data.taxDateOfIssue,
        taxAuthority: data.taxAuthority,
        atmNumber: data.atmNumber,
        bankName: data.bankName,
        bankAddress: data.bankAddress,
        healthInsuranceNumber: data.healthInsuranceNumber,
        healthInsuranceStartDate: data.healthInsuranceStartDate,
        healthInsuranceEndDate: data.healthInsuranceEndDate,
        socialInsuranceNumber: data.socialInsuranceNumber,
        socialInsuranceDetails: data.socialInsuranceDetails,
        nationality: data.nationality,
        religion: data.religion,
        maritalStatus: data.maritalStatus,
        ethnic: data.ethnic,
        professionalSkill: data.professionalSkill,
        foreignLanguage: data.foreignLanguage,
        educationalLevel: data.educationalLevel,
        experiences: data.experiences,
        certificates: certificates,
        degrees: degrees,
        contracts: contracts,
        insurrance: data.insurrance,
        courses: data.courses,
        archivedRecordNumber: data.archivedRecordNumber,
        files: files,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.phoneNumber2,
        personalEmail: data.personalEmail,
        personalEmail2: data.personalEmail2,
        homePhone: data.homePhone,
        emergencyContactPerson: data.emergencyContactPerson,
        relationWithEmergencyContactPerson: data.relationWithEmergencyContactPerson,
        emergencyContactPersonPhoneNumber: data.emergencyContactPersonPhoneNumber,
        emergencyContactPersonEmail: data.emergencyContactPersonEmail,
        emergencyContactPersonHomePhone: data.emergencyContactPersonHomePhone,
        emergencyContactPersonAddress: data.emergencyContactPersonAddress,
        permanentResidence: data.permanentResidence,
        permanentResidenceCountry: data.permanentResidenceCountry,
        permanentResidenceCity: data.permanentResidenceCity,
        permanentResidenceDistrict: data.permanentResidenceDistrict,
        permanentResidenceWard: data.permanentResidenceWard,
        temporaryResidence: data.temporaryResidence,
        temporaryResidenceCountry: data.temporaryResidenceCountry,
        temporaryResidenceCity: data.temporaryResidenceCity,
        temporaryResidenceDistrict: data.temporaryResidenceDistrict,
        temporaryResidenceWard: data.temporaryResidenceWard,
    });
    if(data.disciplines !== undefined){
        let disciplines = data.disciplines;
        for(let x in disciplines){
            await Discipline.create({
                employee: createEmployee._id,
                company: company,
                decisionNumber: disciplines[x].decisionNumber,
                organizationalUnit: disciplines[x].organizationalUnit,
                startDate: disciplines[x].startDate,
                endDate: disciplines[x].endDate,
                type: disciplines[x].type,
                reason: disciplines[x].reason,
            });
        }
    }
    if(data.commendations !== undefined){
        let commendations = data.commendations;
        for(let x in commendations){
            await Commendation.create({
                employee: createEmployee._id,
                company: company,
                decisionNumber: commendations[x].decisionNumber,
                organizationalUnit: commendations[x].organizationalUnit,
                startDate: commendations[x].startDate,
                type: commendations[x].type,
                reason: commendations[x].reason,
            });
        }
    }
    if(data.salaries !== undefined){
        let salaries = data.salaries;
        for(let x in salaries){
            await Salary.create({
                employee: createEmployee._id,
                company: company,
                month: salaries[x].month,
                mainSalary: salaries[x].mainSalary,
                unit: salaries[x].unit,
                bonus: salaries[x].bonus
            });
        }
    }
    if(data.annualLeaves !== undefined){
        let annualLeaves = data.annualLeaves;
        for(let x in annualLeaves){
            await AnnualLeave.create({
                employee: createEmployee._id,
                company: company,
                startDate: annualLeaves[x].startDate,
                endDate: annualLeaves[x].endDate,
                status: annualLeaves[x].status,
                reason: annualLeaves[x].reason,
            });
        }
    }
    // Lấy thông tin nhân viên vừa thêm vào
    let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(createEmployee.emailInCompany);
    var employees = await Employee.find({_id: createEmployee._id});
    var salarys = await Salary.find({employee: createEmployee._id})
    var annualLeaves = await AnnualLeave.find({employee: createEmployee._id})
    var commendations = await Commendation.find({employee: createEmployee._id})
    var disciplines = await Discipline.find({employee: createEmployee._id})

    return {employees, salarys, annualLeaves, commendations, disciplines, ...value};
}



// Cập nhât thông tin nhân viên theo id
exports.updateEmployeeInformation = async (id, data) => {
    // var employee = await Employee.findOne({
    //     _id: id
    // });
    // var employeeContact = await EmployeeContact.findOne({
    //     employee: id
    // });
    // var employeeUpdate = {
    //     avatar: data.avatar ? data.avatar : employee.avatar,
    //     fullName: data.fullName ? data.fullName : employee.fullName,
    //     employeeNumber: data.employeeNumber ? data.employeeNumber : employee.employeeNumber,
    //     MSCC: data.MSCC ? data.MSCC : employee.MSCC,
    //     gender: data.gender ? data.gender : employee.gender,
    //     brithday: data.brithday ? data.brithday : employee.brithday,
    //     birthplace: data.birthplace ? data.birthplace : employee.birthplace,
    //     CMND: data.CMND ? data.CMND : employee.CMND,
    //     dateCMND: data.dateCMND ? data.dateCMND : employee.dateCMND,
    //     addressCMND: data.addressCMND ? data.addressCMND : employee.addressCMND,
    //     emailCompany: data.emailCompany ? data.emailCompany : employee.emailCompany,
    //     numberTax: data.numberTax ? data.numberTax : employee.numberTax,
    //     userTax: data.userTax ? data.userTax : employee.userTax,
    //     startTax: data.startTax ? data.startTax : employee.startTax,
    //     unitTax: data.unitTax ? data.unitTax : employee.unitTax,
    //     ATM: data.ATM ? data.ATM : employee.ATM,
    //     nameBank: data.nameBank ? data.nameBank : employee.nameBank,
    //     addressBank: data.addressBank ? data.addressBank : employee.addressBank,
    //     BHYT: data.BHYT ? data.BHYT : employee.BHYT,
    //     numberBHYT: data.numberBHYT ? data.numberBHYT : employee.numberBHYT,
    //     startDateBHYT: data.startDateBHYT ? data.startDateBHYT : employee.startDateBHYT,
    //     endDateBHYT: data.endDateBHYT ? data.endDateBHYT : employee.endDateBHYT,
    //     numberBHXH: data.numberBHXH ? data.numberBHXH : employee.numberBHXH,
    //     BHXH: data.BHXH ? data.BHXH : employee.BHXH,
    //     national: data.national ? data.national : employee.national,
    //     religion: data.religion ? data.religion : employee.religion,
    //     relationship: data.relationship ? data.relationship : employee.relationship,
    //     cultural: data.cultural ? data.cultural : employee.cultural,
    //     foreignLanguage: data.foreignLanguage ? data.foreignLanguage : employee.foreignLanguage,
    //     educational: data.educational ? data.educational : employee.educational,
    //     experience: data.experience ? data.experience : employee.experience,
    //     certificate: data.certificate ? data.certificate : employee.certificate,
    //     certificateShort: data.certificateShort ? data.certificateShort : employee.certificateShort,
    //     contract: data.contract ? data.contract : employee.contract,
    //     insurrance: data.insurrance ? data.insurrance : employee.insurrance,
    //     course: data.course ? data.course : employee.course,
    //     nation: data.nation ? data.nation : employee.nation,
    //     numberFile: data.numberFile ? data.numberFile : employee.numberFile,
    //     file: data.file ? data.file : employee.file,
    // }
    // var employeeContactUpdate = {
    //     employee: id,
    //     phoneNumber: data.phoneNumber ? data.phoneNumber : employeeContact.phoneNumber,
    //     emailPersonal: data.emailPersonal ? data.emailPersonal : employeeContact.emailPersonal,
    //     phoneNumber2: data.phoneNumber2 ? data.phoneNumber2 : employeeContact.phoneNumber2,
    //     emailPersonal2: data.emailPersonal2 ? data.emailPersonal2 : employeeContact.emailPersonal2,
    //     phoneNumberAddress: data.phoneNumberAddress ? data.phoneNumberAddress : employeeContact.phoneNumberAddress,
    //     friendName: data.friendName ? data.friendName : employeeContact.friendName,
    //     relation: data.relation ? data.relation : employeeContact.relation,
    //     friendPhone: data.friendPhone ? data.friendPhone : employeeContact.friendPhone,
    //     friendEmail: data.friendEmail ? data.friendEmail : employeeContact.friendEmail,
    //     friendPhoneAddress: data.friendPhoneAddress ? data.friendPhoneAddress : employeeContact.friendPhoneAddress,
    //     friendAddress: data.friendAddress ? data.friendAddress : employeeContact.friendAddress,
    //     localAddress: data.localAddress ? data.localAddress : employeeContact.localAddress,
    //     localNational: data.localNational ? data.localNational : employeeContact.localNational,
    //     localCity: data.localCity ? data.localCity : employeeContact.localCity,
    //     localDistrict: data.localDistrict ? data.localDistrict : employeeContact.localDistrict,
    //     localCommune: data.localCommune ? data.localCommune : employeeContact.localCommune,
    //     nowAddress: data.nowAddress ? data.nowAddress : employeeContact.nowAddress,
    //     nowNational: data.nowNational ? data.nowNational : employeeContact.nowNational,
    //     nowCity: data.nowCity ? data.nowCity : employeeContact.nowCity,
    //     nowDistrict: data.nowDistrict ? data.nowDistrict : employeeContact.nowDistrict,
    //     nowCommune: data.nowCommune ? data.nowCommune : employeeContact.nowCommune,
    // }
    // await Employee.findOneAndUpdate({
    //     _id: id
    // }, {
    //     $set: employeeUpdate
    // });
    // await EmployeeContact.findOneAndUpdate({
    //     employee: id
    // }, {
    //     $set: employeeContactUpdate
    // });

    // employeeUpdate = {
    //     ...employeeUpdate,
    //     _id: id
    // };
    // employeeContactUpdate = {
    //     ...employeeContactUpdate,
    //     _id: id
    // }
    // var content = {
    //     employeeContactUpdate,
    //     employeeUpdate
    // }
    // return content;
}



/**
 * Xoá thông tin nhân viên
 * @id : Id nhân viên cần xoá
 */ 
exports.deleteEmployee = async (id) => {
    var employee = await Employee.findOneAndDelete({
        _id: id
    });
    await Discipline.deleteMany({
        employee: id
    });
    await Commendation.deleteMany({
        employee: id
    });
    await AnnualLeave.deleteMany({
        employee: id
    });
    await Salary.deleteMany({
        employee: id
    });
    return employee;
}

/**
 * Kiểm tra sự tồn tại của MSNV
 * @employeeNumber : Mã số nhân viên
 * @company : Id công ty
 */
exports.checkEmployeeExisted = async (employeeNumber, company) => {
    var employee = await Employee.find({
        employeeNumber: employeeNumber,
        company: company
    }, {
        field1: 1
    })
    var checkMSNV = false;
    if (employee.length !== 0) {
        checkMSNV = true
    }
    return checkMSNV;
}

/**
 * Kiểm tra sự tồn tại của email công ty
 * @email : Mã số nhân viên
 */
exports.checkEmployeeCompanyEmailExisted = async (email) => {
    var employee = await Employee.find({
        emailInCompany: email
    }, {
        field1: 1
    })
    var checkEmail = false;
    if (employee.length !== 0) {
        checkEmail = true
    }
    return checkEmail;
}


// Cập nhật(thêm mới) Avatar nhân viên
exports.updateEmployeeAvatar = async (employeeNumber, url, company) => {
    // var employeeinfo = await Employee.findOne({
    //     employeeNumber: employeeNumber,
    //     company: company
    // });
    // avatarUpdate = {
    //     avatar: "fileupload/employee-manage/avatar/" + url
    // }
    // await Employee.findOneAndUpdate({
    //     _id: employeeinfo._id
    // }, {
    //     $set: avatarUpdate
    // });
    // var content = {
    //     _id: employeeinfo._id,
    //     avatar: "fileupload/employee-manage/avatar/" + url
    // }
    // return content;
}

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
exports.updateEmployeeContract = async (employeeNumber, data, url, company) => {
    // var employeeinfo = await Employee.findOne({
    //     employeeNumber: employeeNumber,
    //     company: company
    // });
    // var contractUpdate = {
    //     contract: [...employeeinfo.contract, {
    //         nameContract: data.nameContract,
    //         typeContract: data.typeContract,
    //         startDate: data.startDate,
    //         endDate: data.endDate,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/contract/" + url
    //     }]
    // };
    // await Employee.findOneAndUpdate({
    //     _id: employeeinfo._id
    // }, {
    //     $set: contractUpdate
    // });
    // var content = {
    //     _id: employeeinfo._id,
    //     contract: [...employeeinfo.contract, {
    //         nameContract: data.nameContract,
    //         typeContract: data.typeContract,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/contract/" + url
    //     }]
    // }
    // return content;
}

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
exports.updateEmployeeDegrees = async (employeeNumber, data, url, company) => {
    // var employeeinfo = await Employee.findOne({
    //     employeeNumber: employeeNumber,
    //     company: company
    // });
    // var updateCertificate = {
    //     certificate: [...employeeinfo.certificate, {
    //         nameCertificate: data.nameCertificate,
    //         addressCertificate: data.addressCertificate,
    //         yearCertificate: data.yearCertificate,
    //         typeCertificate: data.typeCertificate,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/certificate/" + url,
    //     }]
    // };
    // await Employee.findOneAndUpdate({
    //     _id: employeeinfo._id
    // }, {
    //     $set: updateCertificate
    // });
    // var content = {
    //     _id: employeeinfo._id,
    //     certificate: [...employeeinfo.certificate, {
    //         nameCertificate: data.nameCertificate,
    //         addressCertificate: data.addressCertificate,
    //         yearCertificate: data.yearCertificate,
    //         typeCertificate: data.typeCertificate,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/certificate/" + url,
    //     }]
    // }
    // return content;
}

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
exports.updateEmployeeCertificates = async (employeeNumber, data, url, company) => {
    // var employeeinfo = await Employee.findOne({
    //     employeeNumber: employeeNumber,
    //     company: company
    // });
    // var updateCertificateShort = {
    //     certificateShort: [...employeeinfo.certificateShort, {
    //         nameCertificateShort: data.nameCertificateShort,
    //         unit: data.unit,
    //         startDate: data.startDate,
    //         endDate: data.endDate,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/certificateshort/" + url,
    //     }]
    // };
    // await Employee.findOneAndUpdate({
    //     _id: employeeinfo._id
    // }, {
    //     $set: updateCertificateShort
    // });
    // var content = {
    //     _id: employeeinfo._id,
    //     certificateShort: [...employeeinfo.certificateShort, {
    //         nameCertificateShort: data.nameCertificateShort,
    //         unit: data.unit,
    //         startDate: data.startDate,
    //         endDate: data.endDate,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/certificateshort/" + url,
    //     }]
    // }
    // return content;
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo MSNV
exports.updateFile = async (employeeNumber, data, url, company) => {
    // var employeeinfo = await Employee.findOne({
    //     employeeNumber: employeeNumber,
    //     company: company
    // });
    // var updateFile = {
    //     file: [...employeeinfo.file, {
    //         nameFile: data.nameFile,
    //         discFile: data.discFile,
    //         number: data.number,
    //         status: data.status,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/file/" + url,
    //     }]
    // };
    // await Employee.findOneAndUpdate({
    //     _id: employeeinfo._id
    // }, {
    //     $set: updateFile
    // });
    // var content = {
    //     _id: employeeinfo._id,
    //     file: [...employeeinfo.file, {
    //         nameFile: data.nameFile,
    //         discFile: data.discFile,
    //         number: data.number,
    //         status: data.status,
    //         file: data.file,
    //         urlFile: "fileupload/employee-manage/file/" + url,
    //     }]
    // }
    // return content;
}


// Kiểm tra sự tồn tại của MSNV trong array 
exports.checkEmployeesExisted = async (data, company) => {
    // var list=[];
    // for(let i=0;i<data.arrayMSNV.length;i++){
    //     let employee=await Employee.findOne({
    //         employeeNumber: data.arrayMSNV[i],
    //         company: company
    //     }, {
    //         field1: 1
    //     })
    //     if(employee===null){
    //         list.push(i);
    //     }
    // }
    // return list;
}

