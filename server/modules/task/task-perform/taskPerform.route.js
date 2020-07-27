const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require('../../../middleware');
const PerformTaskController = require("./taskPerform.controller");

router.get('/tasks/:taskId/log-timer', auth, PerformTaskController.getTaskTimesheetLogs);
router.get('/log-timer/currentTimer/user/:userId', auth, PerformTaskController.getActiveTimesheetLog);
router.post('/log-timer/start-timer', PerformTaskController.startTimesheetLog);
router.post('/log-timer/stop-timer', PerformTaskController.stopTimesheetLog);
router.post('/logs', auth, PerformTaskController.addTaskLog);
router.get('/tasks/:taskId/logs', auth, PerformTaskController.getTaskLog);


//upload file
router.post('/tasks/:taskId/upload-files', auth, uploadFile([{ name: 'files', path: '/files' }], 'array'), PerformTaskController.uploadFile)



//Task Action
router.get('/tasks/:taskId/task-actions', auth, PerformTaskController.confirmAction);
router.post('/tasks/:taskId/task-actions', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/delete', auth, PerformTaskController.deleteTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/files/:fileId',auth, PerformTaskController.deleteFileOfAction);


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



router.patch('/tasks/:taskId', auth, PerformTaskController.editTask);
router.patch('/tasks/:taskId/evaluate', auth, PerformTaskController.evaluateTask);


module.exports = router;