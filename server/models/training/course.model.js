const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const EducationProgram = require('./educationProgram.model');


const CourseSchema = new Schema({
    courseId: { // mã đào tạo
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: { // loại khóa học, ví dụ: đào tạo ngoài/nội bộ
        type: String, // Đặc thù cho loại select {code, value}
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    offeredBy: { // Đơn vị tổ chức/cung cấp khóa học, có thể ở ngoài công ty
        type: String
    },
    coursePlace: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    cost: { // chi phí, đổi sang đối tượng: có đơn vị là triệu VNĐ
        type: String
        // unit: triệu VNĐ/USD
        // value: 
    },
    lecturer: {
        type: String
    },
    employeeCommitmentTime: { // thời gian cam kết làm việc tối thiểu tại công ty sau khi tham gia khóa học
        type: String
    },
    educationProgram: {
        type: Schema.Types.ObjectId,
        ref: EducationProgram,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = Course = mongoose.model("courses", CourseSchema);