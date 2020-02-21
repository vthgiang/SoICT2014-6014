const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware/auth.middleware');

const EducationProgramController = require("./educationProgram.controller");

// get all list educationProgram
router.post('/paginate',auth, EducationProgramController.get);

// create a new a educationProgram
router.post('/',auth, EducationProgramController.create);

// delete a educationProgram
router.delete('/:numberEducation', EducationProgramController.delete);

// update a educationProgram
router.put('/:numberEducation', EducationProgramController.update);


module.exports = router;