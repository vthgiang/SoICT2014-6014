const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng gói thầu dùng để lưu lại thông tin gói thầu đã tham gia
const BiddingPackageSchema = new Schema({
    name: {
        type: String, // tên của gói thầu
    },
    code: {
        type: String, // mã code
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    type: {
        type: Number, // 1: Gói thầu tư vấn, 2: Gói thầu phi tư vấn, 3: Gói thầu hàng hóa, 4: Gói thầu xây lắp, 5: Gói thầu hỗn hợp
        default: 1,
    },
    description: { // Mô tả gói thầu
        type: String
    },
    status: {
        type: Number, // 1: hoạt động, 0: ngưng hoạt động, 2: hoàn thành
        default: 1
    },
    keyPersonnelRequires: [{
        careerPosition: {
            type: Schema.Types.ObjectId,
            ref: "CareerPosition"
        },
        majors: [{
            type: Schema.Types.ObjectId,
            ref: "Major"
        }],
        professionalSkill: {
          type: Number,
          Enum: [1, 2, 3, 4, 5, 6, 7], // 1: trung cấp, 2: cao đẳng, 3: cử nhân, 4: kĩ sư, 5: thạc sĩ, 6: tiến sĩ, 7: giáo sư
        },
        count: Number,

        certificateRequirements: {
            certificates: [{
                type: Schema.Types.ObjectId,
                ref: "Certificate"
            }],
            count: Number,
            certificatesEndDate: Date
        },
        numberYearsOfExperience: Number,
        experienceWorkInCarreer: Number,
        numblePackageWorkInCarreer: Number
    }],
    keyPeople: [
        {
            careerPosition: {
                type: Schema.Types.ObjectId,
                ref: "CareerPosition"
            },
            employees: [{
                type: Schema.Types.ObjectId,
                ref: "Employee"
            }],
        }
    ], 
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.BiddingPackage)
        return db.model('BiddingPackage', BiddingPackageSchema);
    return db.models.BiddingPackage;
}