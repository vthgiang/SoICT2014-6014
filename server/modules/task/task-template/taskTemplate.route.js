const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware');

const TaskTemplateController = require("./taskTemplate.controller");

router.get('/', auth, TaskTemplateController.get);
router.get('/:id', auth, TaskTemplateController.getById);
router.get('/role/:id', auth, TaskTemplateController.getByRole);
router.post('/user', auth, TaskTemplateController.getByUser);
router.post('/create', auth, TaskTemplateController.create);
router.delete('/:id', auth, TaskTemplateController.delete);
router.post('/test', auth, TaskTemplateController.test);
router.patch('/edit/:id',auth,TaskTemplateController.edit);

module.exports = router;
