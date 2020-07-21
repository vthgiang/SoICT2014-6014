const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth } = require('../../../middleware/index');

router.get('/', auth, TaskManagementController.getAllTasks);
router.get('/:id', auth, TaskManagementController.getTask);
router.get('/role/:id/:role', auth, TaskManagementController.getAllTasksCreatedByUser);
router.get('/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate/:startDateAfter/:endDateBefore', TaskManagementController.getPaginatedTasksThatUserHasResponsibleRole);
router.get('/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasAccountableRole);
router.get('/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasConsultedRole);
router.get('/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksCreatedByUser);
router.get('/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasInformedRole);

router.post('/create', auth, TaskManagementController.createTask);
router.delete('/:id', auth, TaskManagementController.deleteTask);
router.patch('/:id', auth, TaskManagementController.editTaskStatus);
router.patch('/archived/:id', auth, TaskManagementController.editArchivedOfTask);
router.get('/sub-task/:id', auth, TaskManagementController.getSubTask);

router.get('/get-task/evaluations', auth, TaskManagementController.getTaskEvaluations)

module.exports = router;