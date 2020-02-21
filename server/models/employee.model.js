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
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
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
    emailCompany: {
        type: String
    },
    nation: {
        type: String
    },
    ATM: {
        type: String,
    },
    nameBank: {
        type: String,
    },
    addressBank: {
        type: String,
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
    numberTax: {
        type: String,
    },
    userTax: {
        type: String,
    },
    startTax: {
        type: String,
    },
    unitTax: {
        type: String,
    },
    certificate: [{
        nameCertificate: String,
        addressCertificate: String,
        yearCertificate: String,
        typeCertificate: String,
        file: String,
        urlFile: String
    }],
    certificateShort: [{
        nameCertificateShort: String,
        unit: String,
        startDate: String,
        endDate: String,
        file: String,
        urlFile: String
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
        file: String,
        urlFile: String
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
        file: String,
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