const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth, uploadFile } = require(`../../../middleware`);

router.get('/tasks', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId/sub-tasks', auth, TaskManagementController.getSubTask);

router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations);

router.post('/tasks', auth, uploadFile([{ name: 'files', path: '/files/task-description' }], 'array'), TaskManagementController.createTask);
router.post('/import', auth, TaskManagementController.importTasks);

router.post('/tasks/project-tasks', auth, TaskManagementController.createProjectTask);

router.delete('/tasks/:taskId', auth, TaskManagementController.deleteTask);

router.get('/analyse/user/:userId', auth, TaskManagementController.getTaskAnalysOfUser);

router.get('/time-sheet', auth, TaskManagementController.getUserTimeSheet);

router.get('/time-sheet/all', auth, TaskManagementController.getAllUserTimeSheet);

router.post('/tasks/project-tasks/cpm', auth, TaskManagementController.createProjectTasksFromCPM);

router.get('/organization-task-dashboard-chart-data', auth, TaskManagementController.getOrganizationTaskDashboardChartData)

module.exports = router;