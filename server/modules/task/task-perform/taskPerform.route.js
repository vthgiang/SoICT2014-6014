const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require('../../../middleware');
const PerformTaskController = require("./taskPerform.controller");

router.get('/tasks/:taskId/timesheet-logs', auth, PerformTaskController.getTaskTimesheetLogs);
router.get('/task-timesheet-logs', auth, PerformTaskController.getActiveTimesheetLog);
router.post('/tasks/:taskId/timesheet-logs/start-timer', PerformTaskController.startTimesheetLog);
router.post('/tasks/:taskId/timesheet-logs/stop-timer', auth, PerformTaskController.stopTimesheetLog);
router.post('/tasks/:taskId/logs', auth, PerformTaskController.addTaskLog);
router.get('/tasks/:taskId/logs', auth, PerformTaskController.getTaskLog);


//upload file
router.post('/tasks/:taskId/files', auth, uploadFile([{ name: 'files', path: '/files' }], 'array'), PerformTaskController.uploadFile)



//Task Action
router.get('/tasks/:taskId/task-actions', auth, PerformTaskController.confirmAction);
router.post('/tasks/:taskId/task-actions', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editTaskAction);
router.delete('/tasks/:taskId/task-actions/:actionId', auth, PerformTaskController.deleteTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/files/:fileId', auth, PerformTaskController.deleteFileOfAction);


//Comment of Task Action
router.post('/tasks/:taskId/task-actions/:actionId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.createCommentOfTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.editCommentOfTaskAction);
router.delete('/tasks/:taskId/task-actions/:actionId/comments/:commentId', auth, PerformTaskController.deleteCommentOfTaskAction);
router.patch('/tasks/:taskId/task-actions/:actionId/comments/files/:fileId', auth, PerformTaskController.deleteFileCommentOfAction);


//Task Comment
router.post('/tasks/:taskId/task-comments', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.createTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.editTaskComment);
router.delete('/tasks/:taskId/task-comments/:commentId', auth, PerformTaskController.deleteTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId/files/:fileId', auth, PerformTaskController.deleteFileTaskComment);


//Comment of Task Comment
router.post('/tasks/:taskId/task-comments/:commentId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.createCommentOfTaskComment);
router.patch('/tasks/:taskId/task-comments/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.editCommentOfTaskComment);
router.delete('/tasks/:taskId/task-comments/comments/:commentId', auth, PerformTaskController.deleteCommentOfTaskComment);
router.patch('/tasks/:taskId/task-comments/:commentId/comments/files/:fileId', auth, PerformTaskController.deleteFileChildTaskComment);



router.patch('/tasks/:taskId', auth, PerformTaskController.editTask);
router.patch('/tasks/:taskId/evaluate', auth, PerformTaskController.evaluateTask);


module.exports = router;