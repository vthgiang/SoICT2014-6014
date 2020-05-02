const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const CourseController = require("./course.controller");

// get all list educationProgram
router.post('/paginate',auth, CourseController.searchCourses);

// get all list educationProgram by education program
router.post('/list',auth, CourseController.getCoursesOfEducationProgram);

// create a new a educationProgram
router.post('/',auth, CourseController.createCourse);

// delete a educationProgram
router.delete('/:id',auth, CourseController.deleteCourse);

// update a educationProgram
router.put('/:id',auth, CourseController.updateCourse);


module.exports = router;