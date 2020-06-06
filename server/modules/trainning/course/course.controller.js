const CourseService = require('./course.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

/**
 * Lấy danh sách khoá đào tạo
 */
exports.searchCourses = async (req, res) => {
    try {
        let data = {};
        if(req.query.page === undefined && req.query.limit === undefined ){
            data = await CourseService.getAllCourses(req.user.company._id)
        } else {
            let params = {
                courseId: req.query.courseId,
                type: req.query.type,
                page: req.query.page !==undefined ? Number(req.query.page) : 0,
                limit: req.query.limit !==undefined ? Number(req.query.limit) :100,
            }
            data = await CourseService.searchCourses(params, req.user.company._id); 
        } 
        await LogInfo(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(200).json({ success: true, messages:["get_list_course_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["get_list_course_faile"], content: {error: error}});
    }
}

/**
 * Thêm mới kháo đào tạo
 */
exports.createCourse = async (req, res) => {
    try {
        if(req.body.courseId.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["course_id_required"], content:{ inputData: req.body } });
        } else if (req.body.name.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["name_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_required"], content:{ inputData: req.body } });
        } else if(req.body.coursePlace.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["course_place_required"], content:{ inputData: req.body } });
        } else if(req.body.offeredBy.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["offered_by_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_required"], content:{ inputData: req.body } });
        } else if(req.body.educationProgram.length===0){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["education_program_required"], content:{ inputData: req.body } });
        } else if(req.body.cost.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["cost_required"], content:{ inputData: req.body } });
        } else if(req.body.employeeCommitmentTime.trim()===""){
            await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_commitment_time_required"], content:{ inputData: req.body } });
        } else {
            var data = await CourseService.createCourse(req.body, req.user.company._id);
            if(data==='have_exist'){
                await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
                res.status(400).json({ success: false, messages: ["course_id_have_exist"], content:{ inputData: req.body } });
            }
            await LogInfo(req.user.email, 'CREATE_COURSE', req.user.company);
            res.status(200).json({ success: true, messages:["create_course_success"], content: data});
        }
        
    } catch (error) {
        await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["create_course_faile"], content: {error: error}});
    }
}

/**
 * Xoá kháo đào tạo
 */
exports.deleteCourse = async (req, res) => {
    try {
        var data = await CourseService.deleteCourse(req.params.id);
        await LogInfo(req.user.email, 'DELETE_COURSE', req.user.company);
        res.status(200).json({ success: true, messages:["delete_course_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'DELETE_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["delete_course_faile"], content: {error: error}});
    }
}

/**
 * Cập nhật thông tin khoá học
 */
exports.updateCourse = async (req, res) => {
    try {
        if (req.body.name.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["name_required"], content:{ inputData: req.body } });
        } else if(req.body.startDate.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["start_date_required"], content:{ inputData: req.body } });
        } else if(req.body.endDate.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["end_date_required"], content:{ inputData: req.body } });
        } else if(req.body.coursePlace.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["course_place_required"], content:{ inputData: req.body } });
        } else if(req.body.offeredBy.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["offered_by_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_required"], content:{ inputData: req.body } });
        } else if(req.body.educationProgram.length===0){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["education_program_required"], content:{ inputData: req.body } });
        } else if(req.body.cost.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["cost_required"], content:{ inputData: req.body } });
        } else if(req.body.employeeCommitmentTime.trim()===""){
            await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(400).json({ success: false, messages: ["employee_commitment_time_required"], content:{ inputData: req.body } });
        } else {
            var data = await CourseService.updateCourse(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_COURSE', req.user.company);
            res.status(200).json({ success: true, messages:["edit_course_success"], content: data});
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["edit_course_faile"], content: {error: req.body}});
    }
}