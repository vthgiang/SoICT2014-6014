const Employee = require('../../../models/employee/employee.model');
const EmployeeContact = require('../../../models/employee/employeeContact.model');
const Discipline = require('../../../models/employee/discipline.model');
const Praise = require('../../../models/employee/commendation.model');
const Sabbatical = require('../../../models/employee/annualLeave.model');
const Salary = require('../../../models/employee/salary.model');
const Department = require('../../../models/super-admin/organizationalUnit.model');
const UserRole = require('../../../models/auth/userRole.model');
const User = require('../../../models/auth/user.model');
const Role = require('../../../models/auth/role.model');

// Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
exports.getUnitAndPositionEmployee = async (emailCompany)=>{
    let roles = [], departments = [];
    let user = await User.findOne({email: emailCompany},{ _id:1 })
    if (user !== null) {
        roles = await UserRole.find({ userId: user._id }).populate([{ path: 'roleId', model: Role }]);
        let newRoles = roles.map(role => role.roleId._id);
        departments = await Department.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'vice_dean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ] 
        });
    }
    if (roles !== []) {
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
    }
    return { roles, departments }
}

// Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
exports.getEmailCompanyByUnitAndPosition = async(unit, position)=>{
    let units = [], roles = [];
        for(let n in unit){
            let unitInfo = await Department.findById(unit[n]);  // Lấy thông tin đơn vị
            units = [...units, unitInfo]
        }
        if (position === null) {
            units.forEach(u => {
                let role = [u.dean, u.vice_dean, u.employee];        // Lấy 3 role của đơn vị vào 1 arr
                roles = roles.concat(role); 
            })
        } else {
            roles = position
        }

        // lấy danh sách người dùng theo phòng ban và chức danh
        let userRoles = await UserRole.find({roleId: {$in: roles}});

        //lấy userID vào 1 arr
        let userId = userRoles.map(userRole => userRole.userId); 

        // Lấy email của người dùng theo phòng ban và chức danh
        var emailUsers = await User.find({_id: {$in: userId}}, {email: 1});
        return emailUsers.map(user => user.email)
}


// Lấy dánh sách nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    };
    if (data.department !== "All") {
        var department = await Department.findById(data.department); //lấy thông tin đơn vị
        if (data.position === "All") {
            var roles = [department.dean, department.vice_dean, department.employee]; //lấy 3 role của đơn vào 1 arr
        } else {
            var roles = [data.position]
        }
        // lấy danh sách người dùng theo phòng ban và chức danh
        var userRoles = await UserRole.find({
            roleId: {
                $in: roles
            }
        });
        var userId = userRoles.map(userRole => userRole.userId) //lấy userID vào 1 arr
        // Lấy email của người dùng theo phòng ban và chức danh
        var emailUsers = await User.find({
            _id: {
                $in: userId
            }
        }, {
            email: 1
        })
        // Thêm tìm kiếm nhân viên theo phòng ban, chức danh vào keySearch
        if (emailUsers.length !== 0) {
            keySearch = {
                ...keySearch,
                $or: []
            }
            for (let x in emailUsers) {
                keySearch = {
                    ...keySearch,
                    $or: [...keySearch.$or, {
                        emailCompany: emailUsers[x].email
                    }]
                }
            }
        }
    }
    // Thêm key tìm kiếm nhân viên theo MSNV vào keySearch
    if (data.employeeNumber !== "") {
        keySearch = {
            ...keySearch,
            employeeNumber: {
                $regex: data.employeeNumber,
                $options: "i"
            }
        }
    };
    // Thêm key tìm kiếm nhân viên theo giới tính vào keySearch
    if (data.gender !== "All") {
        keySearch = {
            ...keySearch,
            gender: {
                $regex: data.gender,
                $options: "i"
            }
        }
    };
    // Thêm key tìm kiếm nhân viên theo trạng thái hoạt động vào keySearch
    if (data.status !== "All") {
        keySearch = {
            ...keySearch,
            status: data.status
        }
    };
    // Số lượng danh sách nhân viên
    var totalList = await Employee.count(keySearch);

    var allEmployee = await Employee.find(keySearch, {
            field1: 1,
            emailCompany: 1
        })
        .sort({
            'createDate': 'desc'
        })
        .skip(data.page).limit(data.limit);
    var data = [];
    var roles = [];
    var departments = [];
    for (let x in allEmployee) {
        let user = await User.findOne({
            email: allEmployee[x].emailCompany
        })
        if (user !== null) {
            roles = await UserRole.find({
                userId: user._id
            }).populate([{
                path: 'roleId',
                model: Role
            }]);
            let newRoles = roles.map(role => role.roleId._id);
            departments = await Department.find({
                $or: [
                    {'dean': { $in: newRoles }}, 
                    {'vice_dean':{ $in: newRoles }}, 
                    {'employee':{ $in: newRoles }}
                ] 
            });
        }
        var employee = await Employee.find({
            _id: allEmployee[x]._id
        });
        var employeeContact = await EmployeeContact.find({
            employee: allEmployee[x]._id
        });
        var salary = await Salary.find({
            employee: allEmployee[x]._id
        })
        var sabbatical = await Sabbatical.find({
            employee: allEmployee[x]._id
        })
        var praise = await Praise.find({
            employee: allEmployee[x]._id
        })
        var discipline = await Discipline.find({
            employee: allEmployee[x]._id
        })
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin"); 
        data[x] = {
            employee,
            departments,
            roles,
            employeeContact,
            salary,
            sabbatical,
            praise,
            discipline
        }
    }
    var contents = {
        data,
        totalList
    }
    return contents;
}

// Kiểm tra sự tồn tại của MSNV
exports.checkMSNV = async (employeeNumber, company) => {
    var idEmployee = await Employee.find({
        employeeNumber: employeeNumber,
        company: company
    }, {
        field1: 1
    })
    var checkMSNV = false;
    if (idEmployee.length !== 0) {
        checkMSNV = true
    }
    return checkMSNV;
}
// Kiểm tra sự tồn tại của email công ty
exports.checkEmail = async (email) => {
    var idEmployee = await Employee.find({
        emailCompany: email
    }, {
        field1: 1
    })
    var checkEmail = false;
    if (idEmployee.length !== 0) {
        checkEmail = true
    }
    return checkEmail;
}

// Lấy thông tin cá nhân
exports.getInforPersonal = async (email) => {
    var roles = [];
    var departments = [];
    let user = await User.findOne({
        email: email
    })
    if (user !== null) {
        roles = await UserRole.find({
            userId: user._id
        }).populate([{
            path: 'roleId',
            model: Role
        }]);
        let newRoles = roles.map(role => role.roleId._id);
        departments = await Department.find({
            $or: [
                {'dean': { $in: newRoles }}, 
                {'vice_dean':{ $in: newRoles }}, 
                {'employee':{ $in: newRoles }}
            ] 
        });
    }
    if (roles !== []) {
        roles = roles.filter(role => role.roleId.name !== "Admin" && role.roleId.name !== "Super Admin");
    }
    var employeeinfo = await Employee.findOne({
        emailCompany: email
    });
    var infoPersonal = await Employee.find({
        _id: employeeinfo._id
    });
    var infoEmployeeContact = await EmployeeContact.find({
        employee: employeeinfo._id
    });
    var salary = await Salary.find({
        employee: employeeinfo._id
    })
    var sabbatical = await Sabbatical.find({
        employee: employeeinfo._id
    })
    var praise = await Praise.find({
        employee: employeeinfo._id
    })
    var discipline = await Discipline.find({
        employee: employeeinfo._id
    })
    var employee = {
        roles: roles,
        departments: departments,
        salary: salary,
        employee: infoPersonal,
        employeeContact: infoEmployeeContact,
        sabbatical: sabbatical,
        praise: praise,
        discipline: discipline
    }
    return employee
}

// Thêm mới nhân viên
exports.create = async (data, company) => {
    var createEmployees = await Employee.create({
        avatar: data.avatar,
        fullName: data.fullName,
        employeeNumber: data.employeeNumber,
        MSCC: data.MSCC,
        company: company,
        gender: data.gender,
        brithday: data.brithday,
        birthplace: data.birthplace,
        CMND: data.CMND,
        dateCMND: data.dateCMND,
        addressCMND: data.addressCMND,
        emailCompany: data.emailCompany,
        numberTax: data.numberTax,
        userTax: data.userTax,
        startTax: data.startTax,
        unitTax: data.unitTax,
        ATM: data.ATM,
        nameBank: data.nameBank,
        addressBank: data.addressBank,
        BHYT: data.BHYT,
        numberBHYT: data.numberBHYT,
        startDateBHYT: data.startDateBHYT,
        endDateBHYT: data.endDateBHYT,
        numberBHXH: data.numberBHXH,
        BHXH: data.BHXH,
        national: data.national,
        religion: data.religion,
        relationship: data.relationship,
        cultural: data.cultural,
        foreignLanguage: data.foreignLanguage,
        educational: data.educational,
        experience: data.experience,
        certificate: data.certificate,
        certificateShort: data.certificateShort,
        contract: data.contract,
        insurrance: data.insurrance,
        course: data.course,
        nation: data.nation,
        numberFile: data.numberFile,
        file: data.file,
    });
    await EmployeeContact.create({
        employee: employees._id,
        phoneNumber: data.phoneNumber,
        emailPersonal: data.emailPersonal,
        phoneNumber2: data.phoneNumber2,
        emailPersonal2: data.emailPersonal2,
        phoneNumberAddress: data.phoneNumberAddress,
        friendName: data.friendName,
        relation: data.relation,
        friendPhone: data.friendPhone,
        friendEmail: data.friendEmail,
        friendPhoneAddress: data.friendPhoneAddress,
        friendAddress: data.friendAddress,
        localAddress: data.localAddress,
        localNational: data.localNational,
        localCity: data.localCity,
        localDistrict: data.localDistrict,
        localCommune: data.localCommune,
        nowAddress: data.nowAddress,
        nowNational: data.nowNational,
        nowCity: data.nowCity,
        nowDistrict: data.nowDistrict,
        nowCommune: data.nowCommune,
    });
    var employee = await Employee.find({
        _id: createEmployees._id
    });
    var employeeContact = await EmployeeContact.find({
        employee: createEmployees._id
    });
    var content = {
        employee,
        employeeContact,
    };
    return content;
}

// Cập nhật thông tin cá nhân
exports.updateInforPersonal = async (email, data) => {
    var employeeInfo = await Employee.findOne({emailCompany: email}, { _id: 1});
    // Thông tin cần cập nhật của thông tin liên hệ 
    var employeeContactUpdate = {
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.phoneNumber2,
        emailPersonal: data.emailPersonal,
        emailPersonal2: data.emailPersonal2,
        phoneNumberAddress: data.phoneNumberAddress,
        friendName: data.friendName,
        relation: data.relation,
        friendPhone: data.friendPhone,
        friendEmail: data.friendEmail,
        friendPhoneAddress: data.friendPhoneAddress,
        friendAddress: data.friendAddress,
        localAddress: data.localAddress,
        localNational: data.localNational,
        localCity: data.localCity,
        localDistrict: data.localDistrict,
        localCommune: data.localCommune,
        nowAddress: data.nowAddress,
        nowNational: data.nowNational,
        nowCity: data.nowCity,
        nowDistrict: data.nowDistrict,
        nowCommune: data.nowCommune,
        updateDate: data.updateDate
    }
    // Thông tin cần cập nhật trong thông tin cơ bản của nhân viên
    var employeeUpdate = {
        gender: data.gender,
        national: data.national,
        nation: data.nation,
        religion: data.religion,
        relationship: data.relationship,
        updateDate: data.updateDate
    }
    // cập nhật thông tin liên hệ vào database
    await EmployeeContact.findOneAndUpdate({employee: employeeInfo._id}, {$set: employeeContactUpdate});
    // cập nhật thông tin cơ bản vào database
    await Employee.findOneAndUpdate({_id: employeeInfo._id}, {$set: employeeUpdate});
    var infoPersonal = await Employee.find({_id: employeeInfo._id});
    var infoEmployeeContact = await EmployeeContact.find({employee: employeeInfo._id});
    return { employee: infoPersonal, employeeContact: infoEmployeeContact};
}

// Cập nhât thông tin nhân viên theo id
exports.updateInfoEmployee = async (id, data) => {
    var employee = await Employee.findOne({
        _id: id
    });
    var employeeContact = await EmployeeContact.findOne({
        employee: id
    });
    var employeeUpdate = {
        avatar: data.avatar ? data.avatar : employee.avatar,
        fullName: data.fullName ? data.fullName : employee.fullName,
        employeeNumber: data.employeeNumber ? data.employeeNumber : employee.employeeNumber,
        MSCC: data.MSCC ? data.MSCC : employee.MSCC,
        gender: data.gender ? data.gender : employee.gender,
        brithday: data.brithday ? data.brithday : employee.brithday,
        birthplace: data.birthplace ? data.birthplace : employee.birthplace,
        CMND: data.CMND ? data.CMND : employee.CMND,
        dateCMND: data.dateCMND ? data.dateCMND : employee.dateCMND,
        addressCMND: data.addressCMND ? data.addressCMND : employee.addressCMND,
        emailCompany: data.emailCompany ? data.emailCompany : employee.emailCompany,
        numberTax: data.numberTax ? data.numberTax : employee.numberTax,
        userTax: data.userTax ? data.userTax : employee.userTax,
        startTax: data.startTax ? data.startTax : employee.startTax,
        unitTax: data.unitTax ? data.unitTax : employee.unitTax,
        ATM: data.ATM ? data.ATM : employee.ATM,
        nameBank: data.nameBank ? data.nameBank : employee.nameBank,
        addressBank: data.addressBank ? data.addressBank : employee.addressBank,
        BHYT: data.BHYT ? data.BHYT : employee.BHYT,
        numberBHYT: data.numberBHYT ? data.numberBHYT : employee.numberBHYT,
        startDateBHYT: data.startDateBHYT ? data.startDateBHYT : employee.startDateBHYT,
        endDateBHYT: data.endDateBHYT ? data.endDateBHYT : employee.endDateBHYT,
        numberBHXH: data.numberBHXH ? data.numberBHXH : employee.numberBHXH,
        BHXH: data.BHXH ? data.BHXH : employee.BHXH,
        national: data.national ? data.national : employee.national,
        religion: data.religion ? data.religion : employee.religion,
        relationship: data.relationship ? data.relationship : employee.relationship,
        cultural: data.cultural ? data.cultural : employee.cultural,
        foreignLanguage: data.foreignLanguage ? data.foreignLanguage : employee.foreignLanguage,
        educational: data.educational ? data.educational : employee.educational,
        experience: data.experience ? data.experience : employee.experience,
        certificate: data.certificate ? data.certificate : employee.certificate,
        certificateShort: data.certificateShort ? data.certificateShort : employee.certificateShort,
        contract: data.contract ? data.contract : employee.contract,
        insurrance: data.insurrance ? data.insurrance : employee.insurrance,
        course: data.course ? data.course : employee.course,
        nation: data.nation ? data.nation : employee.nation,
        numberFile: data.numberFile ? data.numberFile : employee.numberFile,
        file: data.file ? data.file : employee.file,
    }
    var employeeContactUpdate = {
        employee: id,
        phoneNumber: data.phoneNumber ? data.phoneNumber : employeeContact.phoneNumber,
        emailPersonal: data.emailPersonal ? data.emailPersonal : employeeContact.emailPersonal,
        phoneNumber2: data.phoneNumber2 ? data.phoneNumber2 : employeeContact.phoneNumber2,
        emailPersonal2: data.emailPersonal2 ? data.emailPersonal2 : employeeContact.emailPersonal2,
        phoneNumberAddress: data.phoneNumberAddress ? data.phoneNumberAddress : employeeContact.phoneNumberAddress,
        friendName: data.friendName ? data.friendName : employeeContact.friendName,
        relation: data.relation ? data.relation : employeeContact.relation,
        friendPhone: data.friendPhone ? data.friendPhone : employeeContact.friendPhone,
        friendEmail: data.friendEmail ? data.friendEmail : employeeContact.friendEmail,
        friendPhoneAddress: data.friendPhoneAddress ? data.friendPhoneAddress : employeeContact.friendPhoneAddress,
        friendAddress: data.friendAddress ? data.friendAddress : employeeContact.friendAddress,
        localAddress: data.localAddress ? data.localAddress : employeeContact.localAddress,
        localNational: data.localNational ? data.localNational : employeeContact.localNational,
        localCity: data.localCity ? data.localCity : employeeContact.localCity,
        localDistrict: data.localDistrict ? data.localDistrict : employeeContact.localDistrict,
        localCommune: data.localCommune ? data.localCommune : employeeContact.localCommune,
        nowAddress: data.nowAddress ? data.nowAddress : employeeContact.nowAddress,
        nowNational: data.nowNational ? data.nowNational : employeeContact.nowNational,
        nowCity: data.nowCity ? data.nowCity : employeeContact.nowCity,
        nowDistrict: data.nowDistrict ? data.nowDistrict : employeeContact.nowDistrict,
        nowCommune: data.nowCommune ? data.nowCommune : employeeContact.nowCommune,
    }
    await Employee.findOneAndUpdate({
        _id: id
    }, {
        $set: employeeUpdate
    });
    await EmployeeContact.findOneAndUpdate({
        employee: id
    }, {
        $set: employeeContactUpdate
    });

    employeeUpdate = {
        ...employeeUpdate,
        _id: id
    };
    employeeContactUpdate = {
        ...employeeContactUpdate,
        _id: id
    }
    var content = {
        employeeContactUpdate,
        employeeUpdate
    }
    return content;
}


// Cập nhật(thêm mới) Avatar nhân viên
exports.updateAvatar = async (employeeNumber, url, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company: company
    });
    avatarUpdate = {
        avatar: "fileupload/employee-manage/avatar/" + url
    }
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: avatarUpdate
    });
    var content = {
        _id: employeeinfo._id,
        avatar: "fileupload/employee-manage/avatar/" + url
    }
    return content;
}

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
exports.updateContract = async (employeeNumber, data, url, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company: company
    });
    var contractUpdate = {
        contract: [...employeeinfo.contract, {
            nameContract: data.nameContract,
            typeContract: data.typeContract,
            startDate: data.startDate,
            endDate: data.endDate,
            file: data.file,
            urlFile: "fileupload/employee-manage/contract/" + url
        }]
    };
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: contractUpdate
    });
    var content = {
        _id: employeeinfo._id,
        contract: [...employeeinfo.contract, {
            nameContract: data.nameContract,
            typeContract: data.typeContract,
            file: data.file,
            urlFile: "fileupload/employee-manage/contract/" + url
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
exports.updateCertificate = async (employeeNumber, data, url, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company: company
    });
    var updateCertificate = {
        certificate: [...employeeinfo.certificate, {
            nameCertificate: data.nameCertificate,
            addressCertificate: data.addressCertificate,
            yearCertificate: data.yearCertificate,
            typeCertificate: data.typeCertificate,
            file: data.file,
            urlFile: "fileupload/employee-manage/certificate/" + url,
        }]
    };
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: updateCertificate
    });
    var content = {
        _id: employeeinfo._id,
        certificate: [...employeeinfo.certificate, {
            nameCertificate: data.nameCertificate,
            addressCertificate: data.addressCertificate,
            yearCertificate: data.yearCertificate,
            typeCertificate: data.typeCertificate,
            file: data.file,
            urlFile: "fileupload/employee-manage/certificate/" + url,
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
exports.updateCertificateShort = async (employeeNumber, data, url, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company: company
    });
    var updateCertificateShort = {
        certificateShort: [...employeeinfo.certificateShort, {
            nameCertificateShort: data.nameCertificateShort,
            unit: data.unit,
            startDate: data.startDate,
            endDate: data.endDate,
            file: data.file,
            urlFile: "fileupload/employee-manage/certificateshort/" + url,
        }]
    };
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: updateCertificateShort
    });
    var content = {
        _id: employeeinfo._id,
        certificateShort: [...employeeinfo.certificateShort, {
            nameCertificateShort: data.nameCertificateShort,
            unit: data.unit,
            startDate: data.startDate,
            endDate: data.endDate,
            file: data.file,
            urlFile: "fileupload/employee-manage/certificateshort/" + url,
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo MSNV
exports.updateFile = async (employeeNumber, data, url, company) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber,
        company: company
    });
    var updateFile = {
        file: [...employeeinfo.file, {
            nameFile: data.nameFile,
            discFile: data.discFile,
            number: data.number,
            status: data.status,
            file: data.file,
            urlFile: "fileupload/employee-manage/file/" + url,
        }]
    };
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: updateFile
    });
    var content = {
        _id: employeeinfo._id,
        file: [...employeeinfo.file, {
            nameFile: data.nameFile,
            discFile: data.discFile,
            number: data.number,
            status: data.status,
            file: data.file,
            urlFile: "fileupload/employee-manage/file/" + url,
        }]
    }
    return content;
}

//  Xoá thông tin nhân viên theo 
exports.delete = async (id) => {
    var infoEmployee = await Employee.findOneAndDelete({
        _id: id
    });
    var infoEmployeeContact = await EmployeeContact.findOneAndDelete({
        employee: id
    });
    await Discipline.deleteMany({
        employee: id
    });
    await Praise.deleteMany({
        employee: id
    });
    await Sabbatical.deleteMany({
        employee: id
    });
    await Salary.deleteMany({
        employee: id
    });
    var content = {
        infoEmployee,
        infoEmployeeContact

    }
    return content;
}

// Kiểm tra sự tồn tại của MSNV trong array 
exports.checkArrayMSNV = async (data, company) => {
    var list=[];
    for(let i=0;i<data.arrayMSNV.length;i++){
        let employee=await Employee.findOne({
            employeeNumber: data.arrayMSNV[i],
            company: company
        }, {
            field1: 1
        })
        if(employee===null){
            list.push(i);
        }
    }
    return list;
}

