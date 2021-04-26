const express = require("express");
const router = express.Router();
const { auth } = require('../../middleware');

const ProjectController = require("./project.controller");

router.get('/project', auth, ProjectController.get);
router.get('/project/:id', auth, ProjectController.show);
router.post('/project', auth, ProjectController.create);
router.patch('/project/:id', auth, ProjectController.edit);
router.delete('/project/:id', auth, ProjectController.delete);
router.get('/project/:id/getListTasksEval/:evalMonth', auth, ProjectController.getListTasksEval);

module.exports = router;
