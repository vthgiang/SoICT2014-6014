const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require('../../../middleware');
const PerformTaskController = require("./taskPerform.controller");

router.get('/log-timer/:task', auth, PerformTaskController.getTaskTimesheetLogs);
router.get('/log-timer/currentTimer/:user', auth, PerformTaskController.getActiveTimesheetLog);
router.post('/log-timer/start-timer', PerformTaskController.startTimesheetLog);
router.post('/log-timer/stop-timer', PerformTaskController.stopTimesheetLog);
router.post('/add-result/create', auth, PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create', auth, PerformTaskController.createTaskInformation);
router.put('/information-task-template', auth, PerformTaskController.editTaskInformation);
router.post('/logs/history', auth, PerformTaskController.addTaskLog);
router.get('/logs/:id', auth, PerformTaskController.getTaskLog);


//result task
router.post('/', auth, uploadFile([{ name: 'files', path: '/files' }], 'array'), PerformTaskController.uploadFile)
router.post('/result-task/create', auth, PerformTaskController.createTaskResult);
router.put('/result-task/:id', auth, PerformTaskController.editTaskResult);


//Task Action
router.get('/task/:taskId/task-actions', auth, PerformTaskController.confirmAction);
router.post('/tasks/:taskId/task-actions', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/delete', auth, PerformTaskController.deleteTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/files/:fileId', PerformTaskController.deleteFileOfAction); // auth,


//Comment of Task Action
router.post('/tasks/:taskId/task-actions/:actionId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.createCommentOfTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.editCommentOfTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/comments/:commentId/delete', auth, PerformTaskController.deleteCommentOfTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/comments/files/:fileId', auth, PerformTaskController.deleteFileCommentOfAction);


//Task Comment
router.post('/tasks/:taskId/task-comments', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.createTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.editTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId/delete', auth, PerformTaskController.deleteTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId/files/:fileId', auth, PerformTaskController.deleteFileTaskComment);


//Comment of Task Comment
router.post('/tasks/:taskId/task-comments/:commentId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.createCommentOfTaskComment);
router.patch('/tasks/:taskId/task-comments/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.editCommentOfTaskComment);
router.patch('/tasks/:taskId/task-comments/comments/:commentId/delete', auth, PerformTaskController.deleteCommentOfTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId/comments/files/:fileId', auth, PerformTaskController.deleteFileChildTaskComment);





router.patch('/edit/task-responsible/:id', auth, PerformTaskController.editTaskByResponsibleEmployees);
router.patch('/edit/task-accountable/:id', auth, PerformTaskController.editTaskByAccountableEmployees);

router.patch('/evaluate/task-consulted/:id', auth, PerformTaskController.evaluateTaskByConsultedEmployees);
router.patch('/evaluate/task-responsible/:id', auth, PerformTaskController.evaluateTaskByResponsibleEmployees);
router.patch('/evaluate/task-accountable/:id', auth, PerformTaskController.evaluateTaskByAccountableEmployees);


module.exports = router;