const Employee = require('../../../models/employee.model');
const EmployeeContact = require('../../../models/employeeContact.model');
const Discipline = require('../../../models/discipline.model');
const Praise = require('../../../models/praise.model');
const Sabbatical = require('../../../models/sabbatical.model');
const Salary = require('../../../models/salary.model');


// Lấy dánh sách nhân viên
exports.get = async (data) => {
    var keySearch = {};
    if (data.employeeNumber !== "") {
        keySearch = {
            ...keySearch,
            employeeNumber: data.employeeNumber
        }
    };
    // if(data.department!=="All") {
    //     keySearch={department:data.department}
    // };
    if (data.gender !== "") {
        keySearch = {
            ...keySearch,
            gender: data.gender
        }
    };
    var allEmployee = await Employee.find(keySearch).populate({
        path: 'employeeContact',
        model: EmployeeContact
    }).sort({
        'createDate': 'desc'
    }).skip(data.page).limit(data.limit);
    return allEmployee;
}

// Lấy thông tin cá nhân
exports.getInforPersonal= async (email) => {
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
        employee:employeeinfo._id
    })
    var sabbatical = await Sabbatical.find({
        employee:employeeinfo._id
    })
    var praise = await Praise.find({
        employee:employeeinfo._id
    })
    var discipline = await Discipline.find({
        employee:employeeinfo._id
    })
    var employee = {
        salary:salary,
        employee: infoPersonal,
        employeeContact: infoEmployeeContact,
        sabbatical:sabbatical,
        praise:praise,
        discipline:discipline
    }
    return employee
}

// Thêm mới nhân viên
exports.create = async (data) => {
    var employees = await Employee.create({
        avatar: data.avatar,
        fullName: data.fullName,
        employeeNumber: data.employeeNumber,
        MSCC: data.MSCC,
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
    var employeeContact = await EmployeeContact.create({
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
    var content = {
        employees,
        employeeContact
    };
    return content;
}

// Cập nhật thông tin cá nhân
exports.updateInforPersonal = async (email, data) => {
    var infoEmployee = await Employee.findOne({
        emailCompany: email
    });
    // thông tin cần cập nhật của thông tin liên hệ 
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
    // thông tin cần cập nhật của thông tin cơ bản của nhân viên
    var employeeUpdate = {
        gender: data.gender,
        national: data.national,
        nation: data.nation,
        religion: data.religion,
        relationship: data.relationship,
        updateDate: data.updateDate
    }
    // cập nhật thông tin liên hệ vào database
    await EmployeeContact.findOneAndUpdate({
        employee: infoEmployee._id
    }, {
        $set: employeeContactUpdate
    });
    //cập nhật thông tin cơ bản vào database
    await Employee.findOneAndUpdate({
        _id: infoEmployee._id
    }, {
        $set: employeeUpdate
    });

    var content = {
        employeeContactUpdate,
        employeeUpdate
    }
    return content;
}

// Cập nhật Avatar nhân viên
exports.updateAvatar = async (employeeNumber, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    avatarUpdate = {
        avatar: "lib/fileEmployee/" + url
    }
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: avatarUpdate
    });
    var content = {
        _id: employeeinfo._id,
        avatar: "lib/fileEmployee/" + url
    }
    return content;
}

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
exports.updateContract = async (employeeNumber, data, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var contractUpdate = {
        contract: [...employeeinfo.contract, {
            nameContract: data.nameContract,
            typeContract: data.typeContract,
            startDate:data.startDate,
            endDate:data.endDate,
            file: data.file,
            urlFile: url
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
            urlFile: url
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
exports.updateCertificate = async (employeeNumber, data, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var updateCertificate = {
        certificate: [...employeeinfo.certificate, {
            nameCertificate: data.nameCertificate,
            addressCertificate: data.addressCertificate,
            yearCertificate: data.yearCertificate,
            typeCertificate: data.typeCertificate,
            file: data.file,
            urlFile: url,
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
            urlFile: url,
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
exports.updateCertificateShort = async (employeeNumber, data, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var updateCertificateShort = {
        certificateShort: [...employeeinfo.certificateShort, {
            nameCertificateShort: data.nameCertificateShort,
            unit: data.unit,
            startDate: data.startDate,
            endDate: data.endDate,
            file: data.file,
            urlFile: url,
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
            urlFile: url,
        }]
    }
    return content;
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo MSNV
exports.updateFile = async (employeeNumber, data, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    var updateFile = {
        file: [...employeeinfo.file, {
            nameFile: data.nameFile,
            discFile: data.discFile,
            number: data.number,
            status: data.status,
            file: data.file,
            urlFile: url,
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
            urlFile: url,
        }]
    }
    return content;
}
