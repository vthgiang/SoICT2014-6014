const express = require("express");
const router = express.Router();
const {auth} = require('../../middleware');

const TaskTemplateController = require("../../modules/task-template-management/task-template-management.controller");

router.get('/', auth, TaskTemplateController.get);
router.get('/:id', auth, TaskTemplateController.getById);
router.get('/role/:id', auth, TaskTemplateController.getByRole);
router.get('/user/:id/:number/:unit', auth, TaskTemplateController.getByUser);
router.post('/create', auth, TaskTemplateController.create);
router.delete('/:id', auth, TaskTemplateController.delete);
router.post('/test', auth, TaskTemplateController.test);

module.exports = router;
