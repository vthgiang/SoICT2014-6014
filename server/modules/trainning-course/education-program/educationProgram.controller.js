const EducationProgramService = require('./educationProgram.service');

// get all list educationProgram

exports.get = async (req, res) => {
    try {
        var allEducationProgram = await EducationProgramService.get(req.body);
        res.status(200).json({
            message: "success",
            content: allEducationProgram
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// create a new educationProgram
exports.create = async (req, res) => {
    var education = await EducationProgramService.create(req.body);
    try {
        res.status(200).json({
            message: "success",
            content: education
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {
        var educationDelete = await EducationProgramService.delete(req.params.numberEducation);
        if (educationDelete !== null) {
            res.status(200).json({
                message: "success",
                content: educationDelete
            });
        } else {
            res.status(400).json({
                message: "Not find",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update a educationProgram
exports.update = async (req, res) => {
    try {
        var educationUpdate = await EducationProgramService.update(req.params.numberEducation, req.body)
        res.status(200).json({
            message: "success",
            content: educationUpdate
        });

    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}