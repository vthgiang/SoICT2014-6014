const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware');

const TaskTemplateController = require("./taskTemplate.controller");

router.get('/', auth, TaskTemplateController.getAllTaskTemplates);
router.get('/:id', auth, TaskTemplateController.getTaskTemplate);
router.get('/role/:id', auth, TaskTemplateController.getTaskTemplatesOfUserRole);
router.post('/user', auth, TaskTemplateController.searchTaskTemplates);
router.post('/create', auth, TaskTemplateController.createTaskTemplate);
router.delete('/:id', auth, TaskTemplateController.deleteTaskTemplate);
router.patch('/edit/:id',auth,TaskTemplateController.editTaskTemplate);

module.exports = router;
