const EducationProgramService = require('./educationProgram.service');
const { LogInfo, LogError } = require('../../../logs');

// Lấy danh sách tất cả các chương trình đào tạo
exports.getAll = async (req, res) => {
    try {
        var allList = await EducationProgramService.getAll(req.user.company._id);
        await LogInfo(req.user.email, 'GET_ALL_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({
            message: "success",
            content: allList
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_ALL_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// get all list educationProgram
exports.get = async (req, res) => {
    try {
        var allEducationProgram = await EducationProgramService.get(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({
            message: "success",
            content: allEducationProgram
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// create a new educationProgram
exports.create = async (req, res) => {
    try {
        var education = await EducationProgramService.create(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({
            message: "success",
            content: education
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {
        var educationDelete = await EducationProgramService.delete(req.params.id);
        await LogInfo(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.user.company);
        if (educationDelete !== null) {
            res.status(200).json({
                message: "success",
                content: educationDelete
            });
        } else {
            await LogError(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.user.company);
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
        var educationUpdate = await EducationProgramService.update(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({
            message: "success",
            content: educationUpdate
        });

    } catch (error) {
        await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}