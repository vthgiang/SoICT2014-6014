const express = require("express");
const router = express.Router();
const TaskManagementController = require("./task.controller");
const { auth, uploadFile } = require(`../../../middleware`);

router.get('/tasks', auth, TaskManagementController.getTasks);
router.get('/tasks/:taskId/sub-tasks', auth, TaskManagementController.getSubTask);
router.post('/tasks', auth, uploadFile([{ name: 'files', path: '/files/task-description' }], 'array'), TaskManagementController.createTask);
router.post('/tasks/project-tasks', auth, TaskManagementController.createProjectTask);
router.post('/tasks/project-tasks/cpm', auth, TaskManagementController.createProjectTasksFromCPM);
router.delete('/tasks/:taskId', auth, TaskManagementController.deleteTask);



router.get('/task-evaluations', auth, TaskManagementController.getTaskEvaluations);
router.post('/import', auth, TaskManagementController.importTasks);
router.get('/analyse/user/:userId', auth, TaskManagementController.getTaskAnalyseOfUser);
router.get('/organization-task-dashboard-chart-data', auth, TaskManagementController.getOrganizationTaskDashboardChartData)



router.get('/time-sheet', auth, TaskManagementController.getUserTimeSheet);
router.patch('/tasks/:taskId/attributes', auth, TaskManagementController.saveTaskAttributes);
router.patch('/tasks/:taskId/delegation', auth, TaskManagementController.addTaskDelegation);
router.patch('/tasks/:taskId/delegation/revoke', auth, TaskManagementController.revokeTaskDelegation);
router.patch('/tasks/:taskId/delegation/delete', auth, TaskManagementController.deleteTaskDelegation);
router.patch('/tasks/:taskId/delegation/reject', auth, TaskManagementController.rejectTaskDelegation);
router.patch('/tasks/:taskId/delegation/confirm', auth, TaskManagementController.confirmTaskDelegation);
router.patch('/tasks/:taskId/delegation/edit', auth, TaskManagementController.editTaskDelegation);

module.exports = router;