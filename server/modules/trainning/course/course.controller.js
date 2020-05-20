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
        var listCourses = await CourseService.searchCourses(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(200).json({ success: true, messages:["get_list_course_success"], content: listCourses});
    } catch (error) {
        await LogError(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["get_list_course_faile"], content: {error: error}});
    }
}

/** Lấy danh sách khóa học của một chương trình đào tạo */
exports.getCoursesOfEducationProgram = async (req, res) => {
    try {
        var listCourses = await CourseService.getCoursesOfEducationProgram( req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_LIST_COURSE_BY_EDUCATION', req.user.company);
        res.status(200).json({ success: true, messages:["get_list_course_by_education_success"], content: listCourses});
    } catch (error) {
        await LogError(req.user.email, 'GET_LIST_COURSE_BY_EDUCATION', req.user.company);
        res.status(400).json({success: false, messages:["get_list_course_by_education_faile"], content: {error: error}});
    }
}

// Tạo kháo đào tạo
exports.createCourse = async (req, res) => {
    try {
        var data = await CourseService.createCourse(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_COURSE', req.user.company);
        res.status(200).json({ success: true, messages:["create_course_success"], content: data});
    } catch (error) {
        await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["create_course_faile"], content: {error: error}});
    }
}

// Xoá kháo đào tạo
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

// Cập nhật thông tin khoá học
exports.updateCourse = async (req, res) => {
    try {
        var data = await CourseService.updateCourse(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_COURSE', req.user.company);
        res.status(200).json({ success: true, messages:["edit_course_success"], content: data});

    } catch (error) {
        await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
        res.status(400).json({success: false, messages:["edit_course_faile"], content: {error: req.body}});
    }
}