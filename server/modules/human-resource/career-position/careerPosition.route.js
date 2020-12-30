const express = require("express");
const router = express.Router();

const careerPositionController = require("./careerPosition.controller");
const { auth } = require(`../../../middleware`);


router.get('/career-positions', auth, careerPositionController.searchCareerPosition);
router.get('/career-fields', auth, careerPositionController.searchCareerField);
router.get('/career-actions', auth, careerPositionController.searchCareerAction);


router.post('/career-fields', auth, careerPositionController.crateNewCareerField);
router.post('/career-positions', auth, careerPositionController.crateNewCareerPosition);
router.post('/career-actions', auth, careerPositionController.crateNewCareerAction);
// router.post('/career-positions', auth, careerPositionController.createAnnualLeave);

router.patch('/career-positions/:id', auth, careerPositionController.editCareerPosition);
// router.delete('/career-positions/:id', auth, careerPositionController.deleteAnnualLeave);

module.exports = router;