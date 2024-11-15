const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const ProjectController = require("./project.controller");

router.get('/project', auth, ProjectController.get);
router.get('/project/:id', auth, ProjectController.show);
router.post('/project', auth, ProjectController.create);
router.patch('/project/:id', auth, ProjectController.edit);
router.delete('/project/:id', auth, ProjectController.delete);
router.get('/project/:id/getListTasksEval/:evalMonth', auth, ProjectController.getListTasksEval);
router.post('/project/salary-members', auth, ProjectController.getSalaryMembers);

router.post('/project/change-requests', auth, ProjectController.createProjectChangeRequest);
router.get('/project/change-requests/:projectId', auth, ProjectController.getListProjectChangeRequests);
router.patch('/project/change-requests/update-lists', auth, ProjectController.updateListProjectChangeRequests)
router.patch('/project/change-requests/:id/:status', auth, ProjectController.updateStatusProjectChangeRequest);

module.exports = router;
