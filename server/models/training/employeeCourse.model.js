const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Employee = require('../human-resource/employeeContact.model');
const Course = require('./course.model');

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
    result: {
        type: String,
    }

})
module.exports = EmployeeCourse = mongoose.model("employee_courses", EmployeeCourseSchema);