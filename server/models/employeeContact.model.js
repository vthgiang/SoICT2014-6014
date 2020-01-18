const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EmployeeContactSchema = new Schema({
    employeeNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    emailPersonal: {
        type: String,
    },
    phoneNumber2: {
        type: Number,
    },
    emailPersonal2: {
        type: String,
    },
    phoneNumberAddress: {
        type: Number,
    },
    friendName: {
        type: String,
    },
    relation: {
        type: String,
    },
    friendPhone: {
        type: Number,
    },
    friendEmail: {
        type: String,
    },
    friendPhoneAddress: {
        type: Number,
    },
    friendAddress: {
        type: String,
    },
    localAddress: {
        type: String
    },
    localNational: {
        type: String,
    },
    localCity: {
        type: String,
    },
    localDistrict: {
        type: String,
    },
    localCommune: {
        type: String,
    },
    nowAddress: {
        type: String,
        required: true
    },
    nowNational: {
        type: String,
    },
    nowCity: {
        type: String,
    },
    nowDistrict: {
        type: String,
    },
    nowCommune: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = EmployeeContact = mongoose.model("employeeContacts", EmployeeContactSchema);