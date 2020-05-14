const EducationProgramService = require('./educationProgram.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy danh sách tất cả các chương trình đào tạo
 */
exports.getAllEducationPrograms = async (req, res) => {
    try {
        var allLists = await EducationProgramService.getAllEducationPrograms(req.user.company._id);
        await LogInfo(req.user.email, 'GET_ALL_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["get_all_education_program_success"], content: allLists});
    } catch (error) {
        await LogError(req.user.email, 'GET_ALL_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["get_all_education_program_faile"], content: {error: error}});
    }
}

/**
 * Lấy danh sách chương trình đào tạo theo key
 */
exports.searchEducationPrograms = async (req, res) => {
    try {
        var educationPrograms = await EducationProgramService.searchEducationPrograms(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'GET_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["get_education_program_success"], content: educationPrograms});
    } catch (error) {
        await LogError(req.user.email, 'GET_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["get_education_program_faile"], content: {error: error}});
    }
}
/**
 * Thêm mới chương trình đào tạo
 */
exports.createEducationProgram = async (req, res) => {
    try {
        var education = await EducationProgramService.createEducationProgram(req.body,req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["create_education_program_success"], content: education});
    } catch (error) {
        await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["create_education_program_faile"], content: {error: error}});
    }
}

/**
 * Xoá chương trình đào tạo
 */
exports.deleteEducationProgram = async (req, res) => {
    try {
        var deleteEducation = await EducationProgramService.deleteEducationProgram(req.params.id);
        await LogInfo(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["delete_education_program_success"], content: deleteEducation});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["delete_education_program_faile"], content: {error: error}});
    }
}

/**
 * Cập nhật chương trình đào tạo
 */
exports.updateEducationProgram = async (req, res) => {
    try {
        var education = await EducationProgramService.updateEducationProgram(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["edit_education_program_success"], content: education});

    } catch (error) {
        await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["edit_education_program_faile"], content: {error: error}});
    }
}