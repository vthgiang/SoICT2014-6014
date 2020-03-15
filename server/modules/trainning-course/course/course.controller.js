const CourseService = require('./course.service');
const { LogInfo, LogError } = require('../../../logs');

// get all list educationProgram
exports.get = async (req, res) => {
    try {
        res.status(200).json({
            message: "success",
           
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_EDUCATIONPROGRAM', req.user.company._id, req.user.company.short_name);
        rres.status(400).json({
            message: error
        });
    }
}

// create a new educationProgram
exports.create = async (req, res) => {
    try {
        res.status(200).json({
            message: "success",
            
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company._id, req.user.company.short_name);
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {

        res.status(400).json({
            message: "Not find",
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update a educationProgram
exports.update = async (req, res) => {
    try {

        res.status(400).json({
            message: "Not find",
        });

    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}