const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EducationProgram = require("./educationProgram.model");

const CourseSchema = new Schema({
    nameCourse: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
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
    time: {
        type: String
    },
    educationProgram: {
        type: Schema.Types.ObjectId,
        ref: 'educationprograms',
        required: true
    },
    typeCourse: {
        type: String,
        required: true
    },
})

module.exports = Course = mongoose.model("courses", CourseSchema);