const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const ProjectPhaseController = require("./projectPhase.controller");

router.post('/project/project-phase', auth, ProjectPhaseController.createCPMProjectPhase);
router.get('/project/project-phase/:id', auth, ProjectPhaseController.getProjectPhase);
router.get('/project-phase/:id', auth, ProjectPhaseController.get);
router.patch('/project-phase/:id', auth, ProjectPhaseController.editPhase);
router.post('/project-phase', auth, ProjectPhaseController.create);
router.delete('/project-phase/:id', auth, ProjectPhaseController.deletePhase);

module.exports = router;
