const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth } = require('../../../middleware/index');

router.get('/tasks', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId', auth, TaskManagementController.getTaskById);
router.get('/tasks/:taskId/sub-task', auth, TaskManagementController.getSubTask);
router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations);

router.post('/tasks', auth, TaskManagementController.createTask);

router.delete('/tasks/:taskId', auth, TaskManagementController.deleteTask);

router.patch('/tasks/:taskId', auth, TaskManagementController.editTaskStatus);
router.patch('/tasks/:taskId/archived', auth, TaskManagementController.editArchivedOfTask);
router.get('/tasks/organizational-unit/tasks-by-month', auth, TaskManagementController.getAllTaskOfOrganizationalUnit);

module.exports = router;