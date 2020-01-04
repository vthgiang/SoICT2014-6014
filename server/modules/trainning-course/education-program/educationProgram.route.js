const express = require("express");
const router = express.Router();

const EducationProgramController = require("./educationProgram.controller");

// get all list educationProgram
router.get('/', EducationProgramController.get);

// create a new a educationProgram
router.post('/', EducationProgramController.create);

// delete a educationProgram
router.delete('/:numberEducation', EducationProgramController.delete);

// update a educationProgram
router.put('/:numberEducation', EducationProgramController.update);


module.exports = router;