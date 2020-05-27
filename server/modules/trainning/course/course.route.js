const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const CourseController = require("./course.controller");

/**
 * Lấy danh sách khoá đào tạo
 */
router.get('/', auth, CourseController.searchCourses);

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
router.patch('/:id', auth, CourseController.updateCourse);


module.exports = router;