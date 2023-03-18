const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const ProjectPhaseController = require("./projectPhase.controller");

// Giai đoạn
router.post('/project/project-phase', auth, ProjectPhaseController.createCPMProjectPhase);
router.get('/project-phase', auth, ProjectPhaseController.getProjectPhase);
router.get('/project-phase/:id', auth, ProjectPhaseController.getPhase);
router.patch('/project-phase/:id', auth, ProjectPhaseController.editPhase);
router.post('/project-phase', auth, ProjectPhaseController.createPhase);
router.delete('/project-phase/:id', auth, ProjectPhaseController.deletePhase);

// Cột mốc
router.post('/project-milestone', auth, ProjectPhaseController.createMilestone);
router.get('/project-milestone', auth, ProjectPhaseController.getProjectMilestone);
router.patch('/project-milestone/:id', auth, ProjectPhaseController.editMilestone);
router.delete('/project-milestone/:id', auth, ProjectPhaseController.deleteMilestone);

module.exports = router;
