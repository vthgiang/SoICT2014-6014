const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const EducationProgramController = require("./educationProgram.controller");

// Lấy danh sách tất cả các chương trình đào tạo
router.get('/',auth, EducationProgramController.getAll);

// get all list educationProgram
router.post('/paginate',auth, EducationProgramController.get);

// create a new a educationProgram
router.post('/',auth, EducationProgramController.create);

// delete a educationProgram
router.delete('/:id',auth, EducationProgramController.delete);

// update a educationProgram
router.put('/:id',auth, EducationProgramController.update);


module.exports = router;