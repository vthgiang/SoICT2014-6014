const EducationProgram = require('../../../models/educationProgram.model');
//get list educationProgram
exports.get = async (data) => {
    var allEducationProgram = await EducationProgram.find().skip(data.page).limit(data.limit);
    return allEducationProgram;
}

// add a new educationProgram
exports.create = async (data) => {
    var education = await EducationProgram.create({
        nameEducation: data.nameEducation,
        numberEducation: data.numberEducation,
        unitEducation: data.unitEducation,
        positionEducation: data.positionEducation,
    });
    return education;
}

// Delete educationProgram
exports.delete = async (numberEducation) => {
    var educationDelete = await EducationProgram.findOneAndDelete({
        numberEducation: numberEducation
    });
    return educationDelete;
}

// Update educationProgram
exports.update = async (numberEducation, data) => {
    var eduacationChange = {
        numberEducation: data.numberEducation,
        nameEducation: data.nameEducation,
        unitEducation: data.unitEducation,
        positionEducation: data.positionEducation
    };
    var educationUpdate = await EducationProgram.findOneAndUpdate({
        numberEducation: numberEducation
    }, {
        $set: eduacationChange
    });
    return eduacationChange;
}