const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employee = require("./Employee.model");
const Course = require("./Course.model");
const ListEmployeeCourseSchema = new Schema({
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
    result: {
        type: String,
    }

})
module.exports = ListEmployeeCourse = mongoose.model("listEmployeeCourse", ListEmployeeCourseSchema);