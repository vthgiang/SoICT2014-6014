const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeCourseSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    result: { //pass: Đạt, failed: Không đạt
        type: String,
        enum: ['pass', 'failed']
    }

})
module.exports = EmployeeCourse = (db) => db.model("employee_courses", EmployeeCourseSchema);