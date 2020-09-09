const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseId: { // mã đào tạo
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: { // loại khóa học
        type: String,
        required: true,
        enum:['external','internal'] //external- đào tạo ngoài, internal-đào tại nội bộ
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    offeredBy: { // Đơn vị tổ chức/cung cấp khóa học, có thể ở ngoài công ty
        type: String,
        required: true
    },
    coursePlace: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    cost: { 
        number: String,
        unit: {
            type: String,
            enum: ['VND', 'USD']
        }

    },
    lecturer: {
        type: String
    },
    employeeCommitmentTime: { // thời gian cam kết làm việc tối thiểu tại công ty sau khi tham gia khóa học
        type: String,
        required: true
    },
    educationProgram: {
        type: Schema.Types.ObjectId,
        ref: 'education_programs',
        required: true
    },
}, {
    timestamps: true,
});

module.exports = Course = (db) => db.model("courses", CourseSchema);