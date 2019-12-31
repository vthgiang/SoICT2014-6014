const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EducationProgram = require("./EducationProgram.model");

const CourseSchema = new Schema({
    nameCourse: {
        type: String,
        required: true
    },
    numberCourse: {
        type: String,
        required: true
    },
    unitCourse: {
        type: String
    },
    address: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    costsCourse: {
        type: String
    },
    teacherCourse: {
        type: String
    },
    EducationProgram: {
        type: Schema.Types.ObjectId,
        ref: EducationProgram,
        required: true
    },
    typeCourse: {
        type: String,
        required: true
    },
})

module.exports = Course = mongoose.model("course", CourseSchema);