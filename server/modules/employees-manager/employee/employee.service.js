const Employee = require('../../../models/employee.model');
const EmployeeContact = require('../../../models/employeeContact.model');
const Discipline = require('../../../models/discipline.model');
const Praise = require('../../../models/praise.model');
const Sabbatical = require('../../../models/sabbatical.model');
const Salary = require('../../../models/salary.model');


// Lấy dánh sách nhân viên
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    };
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
    var totalList = await Employee.count(keySearch);
    var allEmployee = await Employee.find(keySearch, {
            field1: 1
        })
        .sort({
            'createDate': 'desc'
        })
        .skip(data.page).limit(data.limit);
    var data = [];
    for (let x in allEmployee) {
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
        data[x] = {
            employee,
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

// Lấy thông tin cá nhân
exports.getInforPersonal = async (email) => {
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
    var employees = await Employee.create({
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
            urlFile: "lib/fileEmployee/" + url
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
            urlFile: "lib/fileEmployee/" + url
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
            urlFile: "lib/fileEmployee/" + url,
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
            urlFile: "lib/fileEmployee/" + url,
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
            urlFile: "lib/fileEmployee/" + url,
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
            urlFile: "lib/fileEmployee/" + url,
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
            urlFile: "lib/fileEmployee/" + url,
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
            urlFile: "lib/fileEmployee/" + url,
        }]
    }
    return content;
}