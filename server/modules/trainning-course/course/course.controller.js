const CourseService = require('./course.service');
const {
    LogInfo,
    LogError
} = require('../../../logs');

// Lấy danh sách khoá đào tạo
exports.get = async (req, res) => {
    try {
        var allList = await CourseService.get(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(200).json({
            message: "success",
            content: allList
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_LIST_COURSE', req.user.company);
        res.status(400).json({
            message: error
        });
    }
}

// Lấy danh sách khoá đào tạo theo mã chương trình đào tạo
exports.getByEducation = async (req, res) => {
    try {
        var listCourse = await CourseService.getByEducation( req.body, req.user.company._id);
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
exports.create = async (req, res) => {
    try {
        var newCourse = await CourseService.create(req.body, req.user.company._id);
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
exports.delete = async (req, res) => {
    try {
        var courseDelete = await CourseService.delete(req.params.id);
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
exports.update = async (req, res) => {
    try {
        var courseUpdate = await CourseService.update(req.params.id, req.body);
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