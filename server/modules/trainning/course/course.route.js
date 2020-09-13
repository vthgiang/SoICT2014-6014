const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const CourseController = require("./course.controller");

/** Lấy danh sách khoá đào tạo */
router.get('/courses', auth, CourseController.searchCourses);

router.post('/courses', auth, CourseController.createCourse);

router.patch('/courses/:id', auth, CourseController.updateCourse);
router.delete('/courses/:id', auth, CourseController.deleteCourse);



module.exports = router;