const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const CourseController = require("./course.controller");

// get all list educationProgram
router.get('/',auth, CourseController.get);

// create a new a educationProgram
router.post('/',auth, CourseController.create);

// delete a educationProgram
router.delete('/:numberEducation',auth, CourseController.delete);

// update a educationProgram
router.put('/:numberEducation',auth, CourseController.update);

module.exports = router;