const express = require("express");
const router = express.Router();
const { auth } = require('../../middleware');

const ProjectTemplateController = require("./projectTemplate.controller");

router.get('/project-template', auth, ProjectTemplateController.get);
router.get('/project-template/:id', auth, ProjectTemplateController.show);
router.post('/project-template', auth, ProjectTemplateController.create);
router.patch('/project-template/:id', auth, ProjectTemplateController.edit);
router.delete('/project-template/:id', auth, ProjectTemplateController.delete);
router.get('/project-template/:id/getListTasksEval/:evalMonth', auth, ProjectTemplateController.getListTasksEval);
router.post('/project-template/salary-members', auth, ProjectTemplateController.getSalaryMembers);

router.post('/project-template/change-requests', auth, ProjectTemplateController.createProjectChangeRequest);
router.get('/project-template/change-requests/:projectId', auth, ProjectTemplateController.getListProjectChangeRequests);
router.post('/project-template/change-requests/update-lists', auth, ProjectTemplateController.updateListProjectChangeRequests)
router.patch('/project-template/change-requests/:id/:status', auth, ProjectTemplateController.updateStatusProjectChangeRequest);

module.exports = router;
