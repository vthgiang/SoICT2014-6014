const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationProgramSchema = new Schema({
    nameEducation: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    numberEducation: {
        type: String,
        required: true
    },
    unitEducation: [{
        type: Schema.Types.ObjectId,
        ref: 'departments'
    }],
    positionEducation: [{
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }]
})

module.exports = EducationProgram = mongoose.model("educationsprograms", EducationProgramSchema);