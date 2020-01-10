const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EmployeeSchema = new Schema({
    avatar: {
        type: String
    },
    fullName: {
        type: String,
        required: true
    },
    employeeNumber: {
        type: String,
        required: true
    },
    MSCC: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    brithday: {
        type: String,
        required: true
    },
    birthplace: {
        type: String
    },
    CMND: {
        type: Number,
        required: true
    },
    dateCMND: {
        type: String,
        required: true
    },
    addressCMND: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    emailCompany: {
        type: String
    },
    nation: {
        type: String
    },
    ATM: {
        type: String,
        required: true
    },
    nameBank: {
        type: String,
        required: true
    },
    addressBank: {
        type: String,
        required: true
    },
    national: {
        type: String
    },
    religion: {
        type: String
    },
    relationship: {
        type: String
    },
    cultural: {
        type: String,
        required: true
    },
    foreignLanguage: {
        type: String
    },
    educational: {
        type: String
    },
    numberBHYT: {
        type: String
    },
    startDateBHYT: {
        type: String
    },
    endDateBHYT: {
        type: String
    },
    numberBHXH: {
        type: String,
    },
    Tax: [{
        numberTax: String,
        userTax: String,
        startDate: String,
        unitTax: String,
    }],
    certificate: [{
        nameCertificate: String,
        addressCertificate: String,
        yearCertificate: String,
        typeCertificate: String,
        urlCertificate: String
    }],
    certificateShort: [{
        nameCertificateShort: String,
        unit: String,
        startDate: String,
        endDate: String,
        urlCertificateShort: String
    }],
    experience: [{
        startDate: String,
        endDate: String,
        unit: String,
        position: String
    }],
    contract: [{
        nameContract: String,
        typeContract: String,
        startDate: String,
        endDate: String,
        urlContract: String
    }],
    BHXH: [{
        startDate: String,
        endDate: String,
        position: String,
        unit: String
    }],
    course: [{
        nameCourse: String,
        startDate: String,
        endDate: String,
        typeCourse: String,
        unit: String,
        status: String
    }],
    department: [{
        nameDepartment: String,
        position: String
    }],
    numberFile: {
        type: String
    },
    file: [{
        nameFile: String,
        discFile: String,
        number: String,
        status: String,
        urlFile: String
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = Employee = mongoose.model("employees", EmployeeSchema);