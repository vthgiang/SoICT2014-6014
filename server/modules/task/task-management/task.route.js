const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth } = require('../../../middleware/index');

router.get('/', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId', auth, TaskManagementController.getTaskById);

// router.get('/user/task-responsible/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate/:startDateAfter/:endDateBefore', TaskManagementController.getPaginatedTasksThatUserHasResponsibleRole);
// router.get('/user/task-accountable/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasAccountableRole);
// router.get('/user/task-consulted/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasConsultedRole);
// router.get('/user/task-creator/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksCreatedByUser);
// router.get('/user/task-informed/:unit/:user/:number/:perPage/:status/:priority/:special/:name/:startDate/:endDate', auth, TaskManagementController.getPaginatedTasksThatUserHasInformedRole);

router.post('/create', auth, TaskManagementController.createTask);
router.delete('tasks/:taskId', auth, TaskManagementController.deleteTask);
router.patch('/tasks/:taskId', auth, TaskManagementController.editTaskStatus);
router.patch('tasks/:taskId/archived', auth, TaskManagementController.editArchivedOfTask);
router.get('/tasks/:taskId/sub-task', auth, TaskManagementController.getSubTask);

router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations)

module.exports = router;