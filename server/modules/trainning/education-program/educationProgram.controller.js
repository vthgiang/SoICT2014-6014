const EducationProgramService = require('./educationProgram.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Lấy danh sách chương trình đào tạo
 */
exports.searchEducationPrograms = async (req, res) => {
    try {
        var data;
        if(req.query.limit!==undefined && req.query.page !==undefined){
            let params = {
                organizationalUnit: req.query.organizationalUnit,
                position: req.query.position,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await EducationProgramService.searchEducationPrograms(params, req.user.company._id);
        } else {
            data = await EducationProgramService.getAllEducationPrograms(req.user.company._id);
        }
        await LogInfo(req.user.email, 'GET_EDUCATION_PROGRAM', req.user.company);
        res.status(200).json({ success: true, messages:["get_education_program_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'GET_EDUCATION_PROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["get_education_program_faile"], content: {error: error}});
    }
}
/**
 * Thêm mới chương trình đào tạo
 */
exports.createEducationProgram = async (req, res) => {
    try {
        if(req.body.applyForOrganizationalUnits===null){
            await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["apply_for_organizational_units_required"], content:{ inputData: req.body } });
        } else if (req.body.position===null){
            await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["apply_for_positions_required"], content:{ inputData: req.body } });
        } else if(req.body.programId.trim()===""){
            await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["program_id_required"], content:{ inputData: req.body } });
        } else if(req.body.name.trim()===""){
            await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["name_required"], content:{ inputData: req.body } });
        } else {
            var education = await EducationProgramService.createEducationProgram(req.body,req.user.company._id);
            if(education ==='have_exist'){
                await LogError(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
                res.status(400).json({ success: false, messages: ["program_id_have_exist"], content:{ inputData: req.body } });
            } else{
                await LogInfo(req.user.email, 'CREATE_EDUCATIONPROGRAM', req.user.company);
                res.status(200).json({ success: true, messages:["create_education_program_success"], content: education});
            }
        }
        
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
        if(req.body.applyForOrganizationalUnits===null){
            await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["apply_for_organizational_units_required"], content:{ inputData: req.body } });
        } else if (req.body.position===null){
            await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["apply_for_positions_required"], content:{ inputData: req.body } });
        } else if(req.body.name.trim()===""){
            await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
            res.status(400).json({ success: false, messages: ["name_required"], content:{ inputData: req.body } });
        } else {
            var education = await EducationProgramService.updateEducationProgram(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
            res.status(200).json({ success: true, messages:["edit_education_program_success"], content: education});
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_EDUCATIONPROGRAM', req.user.company);
        res.status(400).json({success: false, messages:["edit_education_program_faile"], content: {error: error}});
    }
}