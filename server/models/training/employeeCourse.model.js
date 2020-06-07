const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Employee = require('../human-resource/employee.model');
const Course = require('./course.model');

const EmployeeCourseSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: Course,
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true
    },
    result: { //pass: Đạt, failed: Không đạt
        type: String,
        enum: ['pass', 'failed']
    }

})
module.exports = EmployeeCourse = mongoose.model("employee_courses", EmployeeCourseSchema);