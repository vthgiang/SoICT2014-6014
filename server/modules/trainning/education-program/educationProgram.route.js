const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const EducationProgramController = require("./educationProgram.controller");

// Lấy danh sách tất cả các chương trình đào tạo
router.get('/',auth, EducationProgramController.getAllEducationPrograms);

// get all list educationProgram
router.post('/paginate',auth, EducationProgramController.searchEducationPrograms);

// create a new a educationProgram
router.post('/',auth, EducationProgramController.createEducationProgram);

// delete a educationProgram
router.delete('/:id',auth, EducationProgramController.deleteEducationProgram);

// update a educationProgram
router.put('/:id',auth, EducationProgramController.updateEducationProgram);


module.exports = router;