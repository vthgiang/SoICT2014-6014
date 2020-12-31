const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth } = require(`../../../middleware`);

router.get('/tasks', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId/sub-tasks', auth, TaskManagementController.getSubTask);

router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations);

router.post('/tasks', auth, TaskManagementController.createTask);

router.delete('/tasks/:taskId', auth, TaskManagementController.deleteTask);

router.get('/analys/user/:userId', auth, TaskManagementController.getTaskAnalysOfUser);

module.exports = router;