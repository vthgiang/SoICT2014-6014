const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware/index');
// const {role} = require('../../../middleware/auth.middleware');

const TaskManagementController = require("./task.controller");

router.get('/', auth, TaskManagementController.getAllTask);
router.get('/:id', auth, TaskManagementController.getTaskById);
router.get('/role/:id/:role', auth, TaskManagementController.getTaskByRole);
router.get('/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getResponsibleTaskByUser);
router.get('/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getAccountableTaskByUser);
router.get('/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getConsultedTaskByUser);
router.get('/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name',auth, TaskManagementController.getCreatorTaskByUser);
router.get('/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getInformedTaskByUser);
router.post('/create', auth, TaskManagementController.create);
router.delete('/:id', auth, TaskManagementController.delete);
router.patch('/:id', auth, TaskManagementController.editStatusOfTask);

module.exports = router;