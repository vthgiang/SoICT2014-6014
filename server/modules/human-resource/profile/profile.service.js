const {
    Employee,
    Discipline,
    Commendation,
    AnnualLeave,
    Salary,
    OrganizationalUnit,
    UserRole,
    User,
    Role,
    EmployeeCourse
} = require('../../../models').schema;

/**
 * Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
 * @emailInCompany: email công ty của nhân viên
 */
exports.getAllPositionRolesAndOrganizationalUnitsOfUser = async (emailInCompany) => {
    let roles = [],organizationalUnits = [];
    let user = await User.findOne({email: emailInCompany}, {_id: 1})
    if (user !== null) {
        roles = await UserRole.find({userId: user._id}).populate([{path: 'roleId', model: Role}]);
        let newRoles = roles.map(role => role.roleId._id);
        organizationalUnits = await OrganizationalUnit.find({
            $or: [{'dean': {$in: newRoles}},
                {'viceDean': {$in: newRoles}},
                {'employee': {$in: newRoles}}
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
 * @organizationalUnits : mảng id phòng ban
 * @position : mảng id chức vụ(role)
 */
exports.getEmployeeEmailsByOrganizationalUnitsAndPositions = async (organizationalUnits, position) => {
    let units = [], roles = [];
    for (let n in organizationalUnits) {
        // Lấy thông tin đơn vị
        let unitInfo = await OrganizationalUnit.findById(organizationalUnits[n]);
        units = [...units, unitInfo]
    }
    if (position === undefined) {
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
    let emailUsers = await User.find({_id: {$in: userId}}, {email: 1});

    return emailUsers.map(user => user.email)
}

/**
 * Lấy thông tin cá nhân của nhân viên theo id user(tài khoản đăng nhập)
 * @userId : id người dùng(tài khoản)
 */
exports.getEmployeeProfile = async (userId) => {
    let user = await User.findById(userId);
    let employees = await Employee.find({emailInCompany: user.email});
    if (employees.length === 0) {
        return {employees: employees}
    } else {
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(user.email);
        let salarys = await Salary.find({employee: employees[0]._id})
        let annualLeaves = await AnnualLeave.find({employee: employees[0]._id})
        let commendations = await Commendation.find({employee: employees[0]._id})
        let disciplines = await Discipline.find({employee: employees[0]._id})
        return { employees: employees, salarys, annualLeaves, commendations, disciplines, ...value}
    }

}

/**
 * Cập nhật thông tin cá nhân của nhân viên
 * @userId : id người dùng
 * @data : dữ liệu chỉnh sửa thông tin của nhân viên
 * @avatar : url file avatar
 */
exports.updatePersonalInformation = async (userId, data, avatar) => {
    if (avatar === "") {avatar = data.avatar;}
    let user = await User.findById(userId);
    let employeeInfo = await Employee.findOne({emailInCompany: user.email}, {_id: 1});
    // Thông tin cần cập nhật 
    let employeeUpdate = {
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
 * Lấy thông tin nhân viên theo id
 * @id : id thông tin nhân viên cần lấy
 */
exports.getEmployeeInforById = async(id)=> {
    return await Employee.findById(id);
}

/**
 * Lấy tất cả danh sách nhân viên đang làm việc của công ty theo đơn vị và phòng ban
 * @company : id công ty
 * @allInfor : true lấy hết thông tin của mỗi nhân viên, false lấy 1 số thông tin của mỗi nhân viên
 */
exports.getEmployees = async(company, organizationalUnits, positions, allInfor=true) => {
    let keySearch = {company: company, status: 'active'};
    if (allInfor === true) {
        if(organizationalUnits !== undefined){
            let emailInCompany = await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(organizationalUnits, positions);
            keySearch = {...keySearch, emailInCompany: {$in: emailInCompany}};
            let totalEmployee = await Employee.countDocuments(keySearch);
            let listEmployeesOfOrganizationalUnits = await Employee.find(keySearch);
            return {totalEmployee, listEmployeesOfOrganizationalUnits}
        }
        let totalAllEmployee = await Employee.countDocuments(keySearch);
        let listAllEmployees = await Employee.find(keySearch);
        return {totalAllEmployee, listAllEmployees}
    } else {
        if(organizationalUnits !== undefined){
            let emailInCompany = await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(organizationalUnits, positions);
            keySearch = {...keySearch, emailInCompany: {$in: emailInCompany}};
            let totalEmployee = await Employee.countDocuments(keySearch);
            let listEmployeesOfOrganizationalUnits = await Employee.find(keySearch, {_id: 1, emailInCompany: 1, fullName: 1, employeeNumber: 1, gender: 1, birthdate: 1});
            return {totalEmployee, listEmployeesOfOrganizationalUnits}
        }
        let totalAllEmployee = await Employee.countDocuments(keySearch);
        let listAllEmployees = await Employee.find(keySearch, {_id: 1, emailInCompany: 1, fullName: 1, employeeNumber: 1, gender: 1, birthdate: 1});
        return {totalAllEmployee, listAllEmployees}
    }
}

/**
 * Lấy danh sách nhân viên theo key tìm kiếm
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchEmployeeProfiles = async (params, company) => {
    let keySearch = {company: company};
    // Bắt sựu kiện đơn vị tìm kiếm khác undefined
    if (params.organizationalUnits !== undefined) {
        let emailInCompany = await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(params.organizationalUnits, params.position);
        keySearch = {...keySearch, emailInCompany: {$in: emailInCompany}}
    }
    // Bắt sựu kiện MSNV tìm kiếm khác ""
    if (params.employeeNumber !==undefined && params.employeeNumber.length !==0) {
        keySearch = {...keySearch, employeeNumber: {$regex: params.employeeNumber, $options: "i"}}
    };

    // Bắt sựu kiện MSNV tìm kiếm khác "undefined"
    if (params.gender !== undefined) {
        keySearch = {...keySearch, gender: {$in: params.gender}};
    };

    // Thêm key tìm kiếm nhân viên theo trạng thái hoạt động vào keySearch
    if (params.status !== undefined) {
        keySearch = {...keySearch, status: { $in: params.status}};
    };
    
    // Lấy danh sách nhân viên
    let totalList = await Employee.count(keySearch);
    let listEmployees = await Employee.find(keySearch, {field1: 1,emailInCompany: 1})
        .sort({'createdAt': 'desc'}).skip(params.page).limit(params.limit);
    let data = [];
    for (let n in listEmployees) {
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(listEmployees[n].emailInCompany);
        let employees = await Employee.find({_id: listEmployees[n]._id});
        let salarys = await Salary.find({employee: listEmployees[n]._id})
        let annualLeaves = await AnnualLeave.find({employee: listEmployees[n]._id})
        let commendations = await Commendation.find({employee: listEmployees[n]._id})
        let disciplines = await Discipline.find({employee: listEmployees[n]._id})
        data[n] = {employees, salarys, annualLeaves, commendations, disciplines, ...value}
    }
    
    return { data, totalList }
}

/**
 * Function merge urlFile upload với object
 * @arrayFile : mảng chứa các file
 * @arrayObject :mảng chứa các object
 */
exports.mergeUrlFileToObject = (arrayFile, arrayObject)=>{
    if (arrayFile !== undefined) {
        arrayObject.forEach(x => {
            arrayFile.forEach(y => {
                if (x.file === y.originalname) {
                    x.urlFile = `/${y.path}`;
                }
            })
        });
        return arrayObject;
    } else return arrayObject;
}

/**
 * Thêm mới nhân viên
 * @data : Dữ liệu thông tin nhân viên
 * @company : Id công ty
 * @fileInfo : Thông tin file đính kèm
 */
exports.createEmployee = async (data, company, fileInfo) => {
    let avatar = fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        fileDegree = fileInfo.fileDegree,
        fileCertificate = fileInfo.fileCertificate,
        fileContract = fileInfo.fileContract,
        file = fileInfo.file;
    let {degrees, certificates, contracts, files} = data;
    degrees = this.mergeUrlFileToObject(fileDegree, degrees);
    certificates = this.mergeUrlFileToObject(fileCertificate, certificates);
    contracts = this.mergeUrlFileToObject(fileContract, contracts);
    files = this.mergeUrlFileToObject(file, files);

    let createEmployee = await Employee.create({
        avatar: avatar,
        fullName: data.fullName,
        employeeNumber: data.employeeNumber,
        employeeTimesheetId: data.employeeTimesheetId,
        company: company,
        gender: data.gender,
        status: data.status,
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
    if (data.disciplines !== undefined) {
        let disciplines = data.disciplines;
        for (let x in disciplines) {
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
    if (data.commendations !== undefined) {
        let commendations = data.commendations;
        for (let x in commendations) {
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
    if (data.salaries !== undefined) {
        let salaries = data.salaries;
        for (let x in salaries) {
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
    if (data.annualLeaves !== undefined) {
        let annualLeaves = data.annualLeaves;
        for (let x in annualLeaves) {
             AnnualLeave.create({
                employee: createEmployee._id,
                company: company,
                startDate: annualLeaves[x].startDate,
                endDate: annualLeaves[x].endDate,
                status: annualLeaves[x].status,
                reason: annualLeaves[x].reason,
            });
        }
    }
    if(data.courses!==undefined){
        let courses = data.courses;
        for (let x in courses) {
            EmployeeCourse.create({
                employee: createEmployee._id,
                course: courses[x].course,
                result: courses[x].result,
            });
        } 
    }
    // Lấy thông tin nhân viên vừa thêm vào
    let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(createEmployee.emailInCompany);
    let employees = await Employee.find({_id: createEmployee._id});
    let salarys = await Salary.find({employee: createEmployee._id})
    let annualLeaves = await AnnualLeave.find({employee: createEmployee._id})
    let commendations = await Commendation.find({employee: createEmployee._id})
    let disciplines = await Discipline.find({employee: createEmployee._id})
    let courses = await EmployeeCourse.find({employee: createEmployee._id})

    return {...value, employees, salarys, annualLeaves, commendations, disciplines, courses};
}



/**
 * Cập nhât thông tin nhân viên theo id
 */
exports.updateEmployeeInformation = async (id, data, fileInfo, company) => {
    let {employee, createExperiences, deleteExperiences, editExperiences, createDegrees, editDegrees, deleteDegrees,
        createCertificates, editCertificates, deleteCertificates, createContracts, editContracts, deleteContracts,
        createDisciplines, editDisciplines, deleteDisciplines, createCommendations, editConmmendations, deleteConmmendations,
        createSalaries, editSalaries, deleteSalaries, createAnnualLeaves, editAnnualLeaves, deleteAnnualLeaves, 
        createFiles, editFiles, deleteFiles, createSocialInsuranceDetails, editSocialInsuranceDetails, deleteSocialInsuranceDetails} = data;
    let avatar = fileInfo.avatar === "" ? employee.avatar : fileInfo.avatar,
        fileDegree = fileInfo.fileDegree,
        fileCertificate = fileInfo.fileCertificate,
        fileContract = fileInfo.fileContract,
        file = fileInfo.file;

    let oldEmployee = await Employee.findById(id);

    deleteEditCreateObjectInArrayObject = (arrObject, arrDelete, arrEdit, arrCreate, fileInfor = undefined) =>{
        if(arrDelete!==undefined) {
            for(let n in arrDelete){
                arrObject = arrObject.filter(x => x._id.toString() !== arrDelete[n]._id);
            };
        };
        if(arrEdit!==undefined){
            if(fileInfor!==undefined){
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for(let n in arrEdit){
                arrObject = arrObject.map(x => (x._id.toString() !== arrEdit[n]._id) ? x : arrEdit[n])
            }
        };
        if(arrCreate!==undefined) {
            if(fileInfor!==undefined){
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach(x => arrObject.push(x));
        };
        return arrObject;
    }
    oldEmployee.experiences = deleteEditCreateObjectInArrayObject(oldEmployee.experiences, deleteExperiences, editExperiences, createExperiences);
    oldEmployee.socialInsuranceDetails = deleteEditCreateObjectInArrayObject(oldEmployee.socialInsuranceDetails, deleteSocialInsuranceDetails, editSocialInsuranceDetails, createSocialInsuranceDetails);

    oldEmployee.degrees = deleteEditCreateObjectInArrayObject(oldEmployee.degrees, deleteDegrees, editDegrees, createDegrees, fileDegree);
    oldEmployee.certificates = deleteEditCreateObjectInArrayObject(oldEmployee.certificates, deleteCertificates, editCertificates, createCertificates, fileCertificate);
    oldEmployee.contracts = deleteEditCreateObjectInArrayObject(oldEmployee.contracts, deleteContracts, editContracts, createContracts, fileContract);
    oldEmployee.files = deleteEditCreateObjectInArrayObject(oldEmployee.files, deleteFiles, editFiles, createFiles, file);

    oldEmployee.avatar= avatar;
    oldEmployee.fullName= employee.fullName;
    oldEmployee.employeeNumber= employee.employeeNumber;
    oldEmployee.employeeTimesheetId= employee.employeeTimesheetId;
    oldEmployee.gender= employee.gender;
    oldEmployee.status= employee.status;
    oldEmployee.birthdate= employee.birthdate;
    oldEmployee.birthplace= employee.birthplace;
    oldEmployee.identityCardNumber= employee.identityCardNumber;
    oldEmployee.identityCardDate= employee.identityCardDate;
    oldEmployee.identityCardAddress= employee.identityCardAddress;
    oldEmployee.emailInCompany= employee.emailInCompany;
    oldEmployee.taxNumber= employee.taxNumber;
    oldEmployee.taxRepresentative= employee.taxRepresentative;
    oldEmployee.taxDateOfIssue= employee.taxDateOfIssue;
    oldEmployee.taxAuthority= employee.taxAuthority;
    oldEmployee.atmNumber= employee.atmNumber;
    oldEmployee.bankName= employee.bankName;
    oldEmployee.bankAddress= employee.bankAddress;
    oldEmployee.healthInsuranceNumber= employee.healthInsuranceNumber;
    oldEmployee.healthInsuranceStartDate= employee.healthInsuranceStartDate;
    oldEmployee.healthInsuranceEndDate= employee.healthInsuranceEndDate;
    oldEmployee.socialInsuranceNumber= employee.socialInsuranceNumber;
    oldEmployee.nationality= employee.nationality;
    oldEmployee.religion= employee.religion;
    oldEmployee.maritalStatus= employee.maritalStatus;
    oldEmployee.ethnic= employee.ethnic;
    oldEmployee.professionalSkill= employee.professionalSkill;
    oldEmployee.foreignLanguage= employee.foreignLanguage;
    oldEmployee.educationalLevel= employee.educationalLevel;
    oldEmployee.insurrance= employee.insurrance;
    oldEmployee.archivedRecordNumber= employee.archivedRecordNumber;
    oldEmployee.phoneNumber= employee.phoneNumber;
    oldEmployee.phoneNumber2= employee.phoneNumber2;
    oldEmployee.personalEmail= employee.personalEmail;
    oldEmployee.personalEmail2= employee.personalEmail2;
    oldEmployee.homePhone= employee.homePhone;
    oldEmployee.emergencyContactPerson= employee.emergencyContactPerson;
    oldEmployee.relationWithEmergencyContactPerson= employee.relationWithEmergencyContactPerson;
    oldEmployee.emergencyContactPersonPhoneNumber= employee.emergencyContactPersonPhoneNumber;
    oldEmployee.emergencyContactPersonEmail= employee.emergencyContactPersonEmail;
    oldEmployee.emergencyContactPersonHomePhone= employee.emergencyContactPersonHomePhone;
    oldEmployee.emergencyContactPersonAddress= employee.emergencyContactPersonAddress;
    oldEmployee.permanentResidence= employee.permanentResidence;
    oldEmployee.permanentResidenceCountry= employee.permanentResidenceCountry;
    oldEmployee.permanentResidenceCity= employee.permanentResidenceCity;
    oldEmployee.permanentResidenceDistrict= employee.permanentResidenceDistrict;
    oldEmployee.permanentResidenceWard= employee.permanentResidenceWard;
    oldEmployee.temporaryResidence= employee.temporaryResidence;
    oldEmployee.temporaryResidenceCountry= employee.temporaryResidenceCountry;
    oldEmployee.temporaryResidenceCity= employee.temporaryResidenceCity;
    oldEmployee.temporaryResidenceDistrict= employee.temporaryResidenceDistrict;
    oldEmployee. temporaryResidenceWard= employee.temporaryResidenceWard;

    // Edit  thông tin nhân viên
    oldEmployee.save();

    // Function edit, create, Delete Document of collection
    queryEditCreateDeleteDocumentInCollection = async (employeeId, company, collection, arrDelete, arrEdit, arrCreate)  => {
        let queryDelete = arrDelete!==undefined ? arrDelete.map(x => {return { deleteOne : { "filter" : { "_id" : x._id} } }}): [];
        let queryEdit = arrEdit!==undefined ? arrEdit.map(x => {
        return { updateOne : {"filter" : { "_id" : x._id }, "update" : { $set : x }}}}) : [];
        let queryCrete = arrCreate !== undefined ? arrCreate.map(x=>{return { insertOne: { "document": {...x, employee: employeeId, company: company} }}}) : [];
        let query = [...queryDelete, ...queryEdit, ...queryCrete];
        if(query.length!==0){
            await collection.bulkWrite(query);
        }
    };
    queryEditCreateDeleteDocumentInCollection(oldEmployee._id, company, Discipline, deleteDisciplines, editDisciplines, createDisciplines );
    queryEditCreateDeleteDocumentInCollection(oldEmployee._id, company, Commendation, deleteConmmendations, editConmmendations, createCommendations );
    queryEditCreateDeleteDocumentInCollection(oldEmployee._id, company, Salary, deleteSalaries, editSalaries, createSalaries );
    queryEditCreateDeleteDocumentInCollection(oldEmployee._id, company, AnnualLeave, deleteAnnualLeaves, editAnnualLeaves, createAnnualLeaves );
    
    // Lấy thông tin nhân viên vừa thêm vào
    let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(oldEmployee.emailInCompany);
    let employees = await Employee.find({_id: oldEmployee._id});
    let salarys = await Salary.find({employee: oldEmployee._id})
    let annualLeaves = await AnnualLeave.find({employee: oldEmployee._id})
    let commendations = await Commendation.find({employee: oldEmployee._id})
    let disciplines = await Discipline.find({employee: oldEmployee._id})

    return {...value, employees, salarys, annualLeaves, commendations, disciplines};
}
/**
 * Xoá thông tin nhân viên
 * @id : Id nhân viên cần xoá
 */
exports.deleteEmployee = async (id) => {
    let employee = await Employee.findOneAndDelete({_id: id});
    await Discipline.deleteMany({employee: id});
    await Commendation.deleteMany({employee: id});
    await AnnualLeave.deleteMany({employee: id});
    await Salary.deleteMany({employee: id});
    return employee;
}

/**
 * Kiểm tra sự tồn tại của MSNV
 * @employeeNumber : Mã số nhân viên
 * @company : Id công ty
 */
exports.checkEmployeeExisted = async (employeeNumber, company) => {
    let employee = await Employee.find({
        employeeNumber: employeeNumber,
        company: company
    }, {field1: 1})
    let checkMSNV = false;
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
    let employee = await Employee.find({
        emailInCompany: email
    }, {field1: 1})
    let checkEmail = false;
    if (employee.length !== 0) {
        checkEmail = true
    }
    return checkEmail;
}
