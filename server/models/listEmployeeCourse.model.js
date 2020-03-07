const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ListEmployeeCourseSchema = new Schema({
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
module.exports = ListEmployeeCourse = mongoose.model("listemployeecourses", ListEmployeeCourseSchema);