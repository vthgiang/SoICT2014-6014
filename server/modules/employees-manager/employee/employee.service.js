const Employee = require('../../../models/employee.model');
const EmployeeContact = require('../../../models/employeeContact.model');


// lấy dánh sách nhân viên
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

// lấy thông tin nhân viên theo id
exports.getById = async (id) => {
    var infoEmployee = await Employee.find({
        _id: id
    });
    var infoEmployeeContact = await EmployeeContact.find({
        employee: id
    });
    var infoEmployee = {
        employee: infoEmployee,
        employeeContact: infoEmployeeContact
    }
    return infoEmployee
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

// Cập nhật Avatar nhân viên
exports.updateAvatar = async (employeeNumber, url) => {
    var employeeinfo = await Employee.findOne({
        employeeNumber: employeeNumber
    });
    avatarUpdate = {
        avatar: "fileEmployee/" + url
    }
    await Employee.findOneAndUpdate({
        _id: employeeinfo._id
    }, {
        $set: avatarUpdate
    });
    var content = {
        _id: employeeinfo._id,
        avatar: "uploadAvatar" + url
    }
    return content;
}

// Cập nhật thông tin cá nhân
exports.updateById = async (id, data) => {
    // thông tin cần cập nhật của thông tin liên hệ 
    var employeeContactUpdate = {
        emailPersonal: data.emailPersonal,
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
        phoneNumber: data.phoneNumber,
        national: data.national,
        nation: data.nation,
        religion: data.religion,
        relationship: data.relationship,
        updateDate: data.updateDate
    }
    // cập nhật thông tin liên hệ vào database
    await EmployeeContact.findOneAndUpdate({
        employee: id
    }, {
        $set: employeeContactUpdate
    });
    //cập nhật thông tin cơ bản vào database
    await Employee.findOneAndUpdate({
        _id: id
    }, {
        $set: employeeUpdate
    });

    var content = {
        employeeContactUpdate,
        employeeUpdate
    }
    return content;
}