const express = require("express");
const router = express.Router();

const careerPositionController = require("./careerPosition.controller");
const { auth } = require(`../../../middleware`);


router.get('/career-positions', auth, careerPositionController.searchCareerPosition);

router.post('/career-positions', auth, careerPositionController.createNewCareerPosition);

router.patch('/career-positions/:id', auth, careerPositionController.editCareerPosition);

router.delete('/career-positions', auth, careerPositionController.deleteCareerPosition);

module.exports = router;
