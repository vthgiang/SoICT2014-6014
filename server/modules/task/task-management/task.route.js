const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware/index');
// const {role} = require('../../../middleware/auth.middleware');

const TaskManagementController = require("./task.controller");

router.get('/', auth, TaskManagementController.getAllTasks);
router.get('/:id', auth, TaskManagementController.getTask);
router.get('/role/:id/:role', auth, TaskManagementController.getAllTasksCreatedByUser);
router.get('/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getPaginatedTasksThatUserHasResponsibleRole);
router.get('/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getPaginatedTasksThatUserHasAccountableRole);
router.get('/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getPaginatedTasksThatUserHasConsultedRole);
router.get('/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name',auth, TaskManagementController.getPaginatedTasksCreatedByUser);
router.get('/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name', auth, TaskManagementController.getPaginatedTasksThatUserHasInformedRole);
router.post('/create', auth, TaskManagementController.createTask);
router.delete('/:id', auth, TaskManagementController.deleteTask);
router.patch('/:id', auth, TaskManagementController.editTaskStatus);
router.get('/sub-task/:id', auth, TaskManagementController.getSubTask);
router.patch('/edit/task-responsible/:id', TaskManagementController.editTaskByResponsibleEmployees);
router.patch('/edit/task-accountable/:id', TaskManagementController.editTaskByAccountableEmployees);

router.patch('/evaluate/task-consulted/:id', TaskManagementController.evaluateTaskByConsultedEmployees);
router.patch('/evaluate/task-responsible/:id', TaskManagementController.evaluateTaskByResponsibleEmployees);
router.patch('/evaluate/task-accountable/:id', TaskManagementController.evaluateTaskByAccountableEmployees);

module.exports = router;