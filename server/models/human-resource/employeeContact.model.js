const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Employee = require('./employee.model');

// Create Schema
const EmployeeContactSchema = new Schema({  // Hợp nhất với Employee
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    personalEmail: {
        type: String,
    },
    phoneNumber2: {
        type: Number,
    },
    personalEmail2: {
        type: String,
    },
    homePhone: { // SĐT nhà riêng
        type: Number,
    },
    emergencyContactPerson: { // Người liên hệ khẩn cấp
        type: String,
    },
    relationWithEmergencyContactPerson: { // Quan hệ với người liên hệ khẩn cấp
        type: String,
    },
    emergencyContactPersonPhoneNumber: {
        type: Number,
    },
    emergencyContactPersonEmail: {
        type: String,
    },
    emergencyContactPersonHomePhone: {
        type: Number,
    },
    emergencyContactPersonAddress: {
        type: String,
    },
    permanentResidence: {  // Địa chỉ hộ khẩu thường trú
        type: String
    },
    permanentResidenceCountry: { // Quốc gia trong hộ khẩu thường trú
        type: String,
    },
    permanentResidenceCity: {
        type: String,
    },
    permanentResidenceDistrict: {
        type: String,
    },
    permanentResidenceWard: { // Phường trong hộ khẩu thường trú
        type: String,
    },
    temporaryResidence: {
        type: String,
        required: true
    },
    temporaryResidenceCountry: {
        type: String,
    },
    temporaryResidenceCity: {
        type: String,
    },
    temporaryResidenceDistrict: {
        type: String,
    },
    temporaryResidenceWard: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = EmployeeContact = mongoose.model("employee_contacts", EmployeeContactSchema);