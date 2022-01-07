const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng gói thầu dùng để lưu lại thông tin gói thầu đã tham gia
const BiddingPackagePersonnalSchema = new Schema({
    biddingPackage: { // gói thầu
        type: Schema.Types.ObjectId,
        ref: "BiddingPackage", 
    },
    code: {
        type: String, // mã code
    },
    file: [{
        type: String
    }],
    keyPersonnels: [{
        careerPosition: {
            type: Schema.Types.ObjectId,
            ref: "CareerPosition"
        },
        majors: [{
            type: Schema.Types.ObjectId,
            ref: "Major"
        }],
        employeeInformation: [{
            employees: [{
                type: Schema.Types.ObjectId,
                ref: "Employee"
            }],
            file: [{
                type: String
            }]
        }],
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.BiddingPackage)
        return db.model('BiddingPackagePersonnal', BiddingPackageSchema);
    return db.models.BiddingPackage;
}