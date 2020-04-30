const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');

// Tạo bảng datatable thông tin nhân viên
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
    status:{
        type:String,
        default: "active"
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    employeeTimesheetId: { // mã số chấm công của nhân viên
        type: String,
        required: true
    },
    gender: { // {code, value}
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    birthplace: {
        type: String
    },
    identityCardNumber: { // số cmnd
        type: Number,
        required: true
    },
    identityCardDate: { // ngày cấp
        type: String,
        required: true
    },
    identityCardAddress: {
        type: String,
        required: true
    },
    emailInCompany: { // địa chỉ email dùng ở company
        type: String
    },
    nationality: { // Quốc tịch
        type: String
    },
    atmNumber: { // Số tài khoản ATM
        type: String,
    },
    bankName: { // Tên ngân hàng
        type: String,
    },
    bankAddress: {
        type: String,
    },
    ethnic: { // Dân tộc
        type: String
    },
    religion: { // Tín ngưỡng
        type: String
    },
    maritalStatus: { // Tình trạng hôn nhân
        type: String
    },
    /**
     * Start
     * Thông tin liên hệ
     */
    phoneNumber: {
        type: Number,
        required: true
    },
    phoneNumber2: {
        type: Number,
    },
    personalEmail: {
        type: String,
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
    /**
     * End
     * Thông tin liên hệ
     */
    educationalLevel: { // trình độ văn hóa
        type: String,
        required: true
    },
    foreignLanguage: { // Trình độ ngoại ngữ
        type: String
    },
    professionalSkill: { // Trình độ chuyên môn
        type: String
    },
    healthInsuranceNumber: {
        type: String
    },
    healthInsuranceStartDate: {
        type: String
    },
    healthInsuranceEndDate: {
        type: String
    },
    socialInsuranceNumber: { // Bảo hiểm XH
        type: String,
    },
    socialInsuranceDetails: [{
        startDate: String,
        endDate: String,
        position: String,
        company: String
    }],
    taxNumber: { // Mã số thuế thu nhập cá nhân
        type: String,
    },
    taxRepresentative: { // Đại diện của người nộp thuế
        type: String,
    },
    taxDateOfIssue: { // ngày cấp mã số thuế
        type: String,
    },
    taxAuthority: { // Cơ quan quản lý thuế (theo mã số thuế đã cấp)
        type: String,
    },
    degrees: [{ // Bằng cấp
        name: String,
        issuedBy: String,
        year: String,
        degreeType: String,
        file: String,
        urlFile: String
    }],
    certificates: [{ // Chứng chỉ ngắn hạn
        name: String,
        issuedBy: String,
        startDate: String,
        endDate: String,
        file: String,
        urlFile: String
    }],
    experiences: [{ // Kinh nghiệm làm việc
        startDate: String,
        endDate: String,
        company: String,
        position: String
    }],
    contracts: [{
        name: String,
        contractType: String,
        startDate: String,
        endDate: String,
        file: String,
        urlFile: String
    }],
    courses: [{
        name: String,
        startDate: String,
        endDate: String,
        courseType: String,
        offeredBy: String, // tổ chức bởi đơn vị nào
        status: String // hoàn thành/chưa hoàn thành/đang tham gia/không đạt khoa học {code, value}
    }],
    archivedRecordNumber: { // Mã hồ sơ lưu trữ
        type: String
    },
    files: [{ // Các file scan đính kèm
        name: String,
        description: String,
        number: String,
        status: String,
        file: String,
        urlFile: String
    }],
}, {
    timestamps: true,
});

module.exports = Employee = mongoose.model("employees", EmployeeSchema);