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
        var listCourse = await CourseService.getCoursesOfEducationProgram( req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_LIST_COURSE_BY_EDUCATION', req.user.company);
        res.status(200).json({
            message: "success",
            content: listCourse
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_LIST_COURSE_BY_EDUCATION', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Tạo kháo đào tạo
exports.createCourse = async (req, res) => {
    try {
        var newCourse = await CourseService.createCourse(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'CREATE_COURSE', req.user.company);
        res.status(200).json({
            message: "success",
            content: newCourse
        });
    } catch (error) {
        await LogError(req.user.email, 'CREATE_COURSE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Xoá kháo đào tạo
exports.deleteCourse = async (req, res) => {
    try {
        var courseDelete = await CourseService.deleteCourse(req.params.id);
        await LogInfo(req.user.email, 'DELETE_COURSE', req.user.company);
        res.status(200).json({
            message: "success",
            content: courseDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Cập nhật thông tin khoá học
exports.updateCourse = async (req, res) => {
    try {
        var courseUpdate = await CourseService.updateCourse(req.params.id, req.body);
        await LogInfo(req.user.email, 'EDIT_COURSE', req.user.company);
        res.status(200).json({
            message: "success",
            content: courseUpdate
        });

    } catch (error) {
        await LogError(req.user.email, 'EDIT_COURSE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}