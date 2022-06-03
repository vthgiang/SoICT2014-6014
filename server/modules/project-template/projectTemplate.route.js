const express = require("express");
const router = express.Router();
const { auth } = require('../../middleware');

const ProjectTemplateController = require("./projectTemplate.controller");

router.get('/project-template', auth, ProjectTemplateController.get);
router.get('/project-template/:id', auth, ProjectTemplateController.show);
router.post('/project-template', auth, ProjectTemplateController.create);
router.patch('/project-template/:id', auth, ProjectTemplateController.edit);
router.delete('/project-template/:id', auth, ProjectTemplateController.delete);

router.post('/project-template/salary-members', auth, ProjectTemplateController.getSalaryMembers);
router.post('/project-template/:templateId/project/create-cpm', auth, ProjectTemplateController.createProjectCpmByProjectTemplate);

module.exports = router;
