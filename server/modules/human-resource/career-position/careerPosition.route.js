const express = require("express");
const router = express.Router();

const careerPositionController = require("./careerPosition.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/career-positions', auth, careerPositionController.searchCareerPosition);
router.get('/career-fields', auth, careerPositionController.searchCareerField);
router.get('/career-actions', auth, careerPositionController.searchCareerAction);


router.post('/career-fields', auth, careerPositionController.crateNewCareerField);
router.post('/career-positions', auth, careerPositionController.crateNewCareerPosition);
router.post('/career-actions', auth, careerPositionController.crateNewCareerAction);

router.patch('/career-fields/:id', auth, careerPositionController.editCareerField);
router.patch('/career-positions/:id', auth, careerPositionController.editCareerPosition);
router.patch('/career-actions/:id', auth, careerPositionController.editCareerAction);

router.delete('/career-fields', auth, careerPositionController.deleteCareerField);
router.delete('/career-positions', auth, careerPositionController.deleteCareerPosition);
router.delete('/career-actions', auth, careerPositionController.deleteCareerAction);

module.exports = router;