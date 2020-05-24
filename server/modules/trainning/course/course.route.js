const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const CourseController = require("./course.controller");

/**
 * Lấy danh sách khoá đào tạo
 */
router.post('/paginate', auth, CourseController.searchCourses);

/**
 * Thêm mới kháo đào tạo
 */
router.post('/', auth, CourseController.createCourse);

/**
 * Xoá kháo đào tạo
 */
router.delete('/:id', auth, CourseController.deleteCourse);

/**
 * Cập nhật thông tin khoá học
 */
router.put('/:id', auth, CourseController.updateCourse);


module.exports = router;