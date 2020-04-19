const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware/index');
// const {role} = require('../../../middleware/auth.middleware');

const TaskManagementController = require("./task-management.controller");

router.get('/', auth, TaskManagementController.get);
router.get('/:id', auth, TaskManagementController.getById);
router.get('/role/:id/:role', auth, TaskManagementController.getByRole);
router.get('/user/task-responsible/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', auth, TaskManagementController.getTaskResponsibleByUser);
router.get('/user/task-accounatable/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', auth, TaskManagementController.getTaskAccounatableByUser);
router.get('/user/task-consulted/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', auth, TaskManagementController.getTaskConsultedByUser);
router.get('/user/task-creator/:unit/:user/:number/:perpage/:status/:priority/:specical/:name',auth, TaskManagementController.getTaskCreatorByUser);
router.get('/user/task-informed/:unit/:user/:number/:perpage/:status/:priority/:specical/:name', auth, TaskManagementController.getTaskInformedByUser);
router.post('/create', auth, TaskManagementController.create);
router.delete('/:id', auth, TaskManagementController.delete);
router.patch('/:id', auth, TaskManagementController.editStatusOfTask);

module.exports = router;