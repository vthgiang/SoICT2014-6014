const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationProgramSchema = new Schema({
    nameEducation: {
        type: String,
        required: true
    },
    numberEducation: {
        type: String,
        required: true
    },
    unitEducation: [{
        type: String,
    }],
    positionEducation: [{
        type: String
    }]
})

module.exports = EducationProgram = mongoose.model("educationsProgram", EducationProgramSchema);