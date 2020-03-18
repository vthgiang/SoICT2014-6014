const express = require("express");
const router = express.Router();
const {auth} = require('../../middleware/auth.middleware');
const {role} = require('../../middleware/auth.middleware');

const TaskTemplateController = require("../../modules/task-template-management/task-template-management.controller");

router.get('/', auth, TaskTemplateController.get);
router.get('/:id', auth, TaskTemplateController.getById);
router.get('/role/:id', auth, TaskTemplateController.getByRole);
router.get('/user/:id/:number/:unit',TaskTemplateController.getByUser);
router.post('/create', TaskTemplateController.create);
router.delete('/:id', auth, TaskTemplateController.delete);
router.post('/test', auth, TaskTemplateController.test);

module.exports = router;
