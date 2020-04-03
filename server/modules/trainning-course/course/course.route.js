const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const CourseController = require("./course.controller");

// get all list educationProgram
router.post('/paginate',auth, CourseController.get);

// get all list educationProgram by education program
router.post('/list',auth, CourseController.getByEducation);

// create a new a educationProgram
router.post('/',auth, CourseController.create);

// delete a educationProgram
router.delete('/:id',auth, CourseController.delete);

// update a educationProgram
router.put('/:id',auth, CourseController.update);


module.exports = router;