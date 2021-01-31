const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable thông tin nhân viên
const EmployeeSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
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
    status: { // active - Làm chính thức, leave - Đã nghỉ làm, maternity_leave: Nghỉ thai sản, unpaid_leave: Nghỉ không lương, probationary: Đang thử việc, sick_leave: Nghỉ ốm đau
        type: String,
        default: 'active',
        enum: ['active', 'leave','maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave']
    },
    startingDate: { // Ngày bắt đầu làm việc
        type: Date,
    },
    leavingDate: { // Ngày nghỉ việc
        type: Date,
    },
    employeeTimesheetId: { // mã số chấm công của nhân viên
        type: String,
        required: true
    },
    gender: { // male - nam, female - nữ
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    birthdate: {
        type: Date,
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
        type: Date,
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
    maritalStatus: { // Tình trạng hôn nhân: single - Độc thân, married - Đã kết hôn
        type: String,
        enum: ['single', 'married']
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
    permanentResidence: { // Địa chỉ hộ khẩu thường trú
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
    educationalLevel: { // Trình độ văn hóa
        type: String,
        // enum: ['12/12', '11/12', '10/12', '9/12']
    },
    foreignLanguage: { // Trình độ ngoại ngữ
        type: String
    },
    professionalSkill: { // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có 
        type: String,
        enum: ['intermediate_degree', 'colleges', 'university', 'bachelor', 'engineer', 'master_degree', 'phd', 'unavailable']
    },
    healthInsuranceNumber: {
        type: String
    },
    healthInsuranceStartDate: {
        type: Date
    },
    healthInsuranceEndDate: {
        type: Date
    },
    healthInsuranceAttachment: [{
       fileName: {
            type: String,
        },
        url: {
            type: String
        } 
    }],
    socialInsuranceNumber: { // Bảo hiểm XH
        type: String,
    },
    socialInsuranceDetails: [{
        startDate: Date,
        endDate: Date,
        position: String,
        company: String,
        money: Number,
    }],
    taxNumber: { // Mã số thuế thu nhập cá nhân
        type: String,
    },
    taxRepresentative: { // Đại diện của người nộp thuế
        type: String,
    },
    taxDateOfIssue: { // ngày cấp mã số thuế
        type: Date,
    },
    taxAuthority: { // Cơ quan quản lý thuế (theo mã số thuế đã cấp)
        type: String,
    },
    degrees: [{ // Bằng cấp
        name: String,
        issuedBy: String,
        year: Number,
        degreeType: {
            type: String,
            enum: ['excellent', 'very_good', 'good', 'average_good', 'ordinary'] //excellent-Xuất sắc, very_good-Giỏi, good-Khá, average_good-Trung bình khá, ordinary-Trung bình
        },
        field:{
            type: Schema.Types.ObjectId,
            ref: 'Field',
        },
        file: String,
        urlFile: String
    }],
    certificates: [{ // Chứng chỉ ngắn hạn
        name: String,
        issuedBy: String,
        startDate: Date,
        endDate: Date,
        file: String,
        urlFile: String
    }],
    experiences: [{ // Kinh nghiệm làm việc
        startDate: Date,
        endDate: Date,
        company: String,
        position: String
    }],
    contractEndDate: {
        type: Date
    },
    contractType: {
        type: String
    },
    contracts: [{
        name: String,
        contractType: String,
        startDate: Date,
        endDate: Date,
        file: String,
        urlFile: String
    }],
    archivedRecordNumber: { // Mã hồ sơ lưu trữ
        type: String
    },
    files: [{ // Các file scan đính kèm
        name: String,
        description: String,
        number: String,
        status: {
            type: String,
            enum: ['submitted', 'not_submitted_yet', 'returned'] //submitted-Đã nộp, not_submitted_yet-Chưa nộp, returned-Đã trả
        },
        file: String,
        urlFile: String
    }],
    major: [{
        group: {
            name: String,
            id: String,
            code: String
        },
        specialized: {
            name: String,
            id: String,
            code: String
        },
        file: String,
        urlFile: String
    }],
    career: [{
        package: [{
            type: String,
        }],
        field: [{
            type: Schema.Types.ObjectId,
            ref: 'CareerField',
        }],
        position: {
            type: Schema.Types.ObjectId,
            ref: "CareerPosition",
        },
        action: [{
            type: Schema.Types.ObjectId,
            ref: "CareerAction",
        }],
        startDate: Date,
        endDate: Date,
        file: String,
        urlFile: String
    }],
    houseHold: {
        headHouseHoldName: { type: String }, // tên chủ hộ
        documentType: { type: String }, // loại giấy tờ
        houseHoldNumber: { type: String }, // số hộ khẩu
        city: { type: String }, // thành phố, tỉnh
        district: { type: String }, // quận, huyện
        ward: { type: String }, // phường ,xã
        houseHoldAddress: { type: String }, // Địa chỉ hộ khẩu
        phone: { type: String }, // Số điện thoại
        houseHoldCode: { type: String }, // mã sổ hộ khẩu

        // Thông tin các thành viên trong hộ gia đình
        familyMembers: [{
            name: { type: String }, // tên
            codeSocialInsurance: { type: String }, // mã số BHXH
            bookNumberSocialInsurance: { type: String }, // Số sổ BHXH
            gender: { type: String, enum: ['male', 'female'], default: 'male' }, // Giới tính
            isHeadHousehold: { type: String, enum: ['yes', 'no'], default: 'no' }, // Là chủ hộ
            relationshipWithHeadHousehold: { type: String }, // Quan hệ với chủ hộ
            birth: { type: Date }, // Ngày sinh
            ccns: { type: String }, // CNSS
            placeOfBirthCertificate: { type: String }, // Nơi cấp giấy khai sinh
            nationality: { type: String }, // Quốc tịch
            nation: { type: String }, // Dân tộc
            numberPassport: { type: String }, // Số CMND, Hộ chiếu
            note: { type: String } // Ghi chú
        }]
    }
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Employee)
        return db.model('Employee', EmployeeSchema);
    return db.models.Employee;
}