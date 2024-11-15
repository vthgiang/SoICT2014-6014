const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`../../../middleware`);
const PerformTaskController = require("./taskPerform.controller");


router.get('/tasks/:taskId', auth, PerformTaskController.getTaskById);
router.post('/tasks/:taskId', auth, uploadFile([{ name: 'files', path: '/files/task-description' }], 'array'), PerformTaskController.editTask);


router.get('/task-timesheet-logs', auth, PerformTaskController.getTaskTimesheetLog);
router.get('/tasks/:taskId/timesheet-logs', auth, PerformTaskController.getTaskTimesheetLogs);

router.post('/tasks/:taskId/timesheet-logs/start-timer', auth, PerformTaskController.startTimesheetLog);
router.post('/tasks/:taskId/timesheet-logs/stop-timer', auth, PerformTaskController.stopTimesheetLog);

router.patch('/tasks/:taskId/timesheet-logs/:timesheetlogId', auth, PerformTaskController.editTimeSheetLog);


// Task log

router.get('/tasks/:taskId/logs', auth, PerformTaskController.getTaskLog);

router.post('/tasks/:taskId/logs', auth, PerformTaskController.addTaskLog);


// Upload file

router.post('/tasks/:taskId/files', auth, uploadFile([{ name: 'files', path: '/files' }], 'array'), PerformTaskController.uploadFile)

router.patch('/tasks/:taskId/documents', auth, uploadFile([{ name: 'files', path: '/files' }], 'array'), PerformTaskController.editDocument)

router.delete('/tasks/:taskId/documents/:documentId', auth, PerformTaskController.deleteDocument)

router.patch('/tasks/:taskId/documents/:documentId/files/:fileId', auth, PerformTaskController.deleteFileTask)


//Task Action

router.post('/tasks/:taskId/task-actions/:actionId', auth, PerformTaskController.confirmAction);
router.post('/tasks/:taskId/task-actions', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createTaskAction);

router.patch('/tasks/:taskId/task-actions/:actionId', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editTaskAction);
router.patch('/tasks/:taskId/task-actions/evaluation/all', auth, PerformTaskController.evaluationAllAction);

router.delete('/tasks/:taskId/task-actions/:actionId', auth, PerformTaskController.deleteTaskAction);
router.delete('/tasks/:taskId/task-actions/:actionId/evaluation/:evaluationId', auth, PerformTaskController.deleteActionEvaluation);

router.patch('/tasks/:taskId/task-actions/:actionId/files/:fileId', auth, PerformTaskController.deleteFileOfAction);
router.post('/tasks/:taskId/sort', auth, PerformTaskController.sortActions);


// Comment of Task Action

router.post('/tasks/:taskId/task-actions/:actionId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.createCommentOfTaskAction);

router.patch('/tasks/:taskId/task-actions/:actionId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentofactions' }], 'array'), PerformTaskController.editCommentOfTaskAction);

router.delete('/tasks/:taskId/task-actions/:actionId/comments/:commentId', auth, PerformTaskController.deleteCommentOfTaskAction);

router.patch('/tasks/:taskId/task-actions/:actionId/comments/files/:fileId', auth, PerformTaskController.deleteFileCommentOfAction);


// Task Comment

router.post('/tasks/:taskId/task-comments', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.createTaskComment);

router.patch('/tasks/:taskId/task-comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/taskcomments' }], 'array'), PerformTaskController.editTaskComment);

router.delete('/tasks/:taskId/task-comments/:commentId', auth, PerformTaskController.deleteTaskComment);

router.patch('/tasks/:taskId/task-comments/:commentId/files/:fileId', auth, PerformTaskController.deleteFileTaskComment);


// Comment of Task Comment

router.post('/tasks/:taskId/task-comments/:commentId/comments', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.createCommentOfTaskComment);

router.patch('/tasks/:taskId/task-comments/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/commentoftaskcomment' }], 'array'), PerformTaskController.editCommentOfTaskComment);

router.delete('/tasks/:taskId/task-comments/comments/:commentId', auth, PerformTaskController.deleteCommentOfTaskComment);

router.patch('/tasks/:taskId/task-comments/:commentId/comments/files/:fileId', auth, PerformTaskController.deleteFileChildTaskComment);


// Task Information

router.patch('/tasks/:taskId/task-informations', auth, PerformTaskController.editTaskInformation);

router.post('/tasks/:taskId/evaluate', auth, PerformTaskController.evaluateTask);

router.delete('/tasks/:taskId/evaluations/:evaluationId', auth, PerformTaskController.deleteEvaluation);


// Comments in process

router.get('/process/tasks/:taskId', auth, PerformTaskController.getAllPreceedingTasks)

router.post('/process/tasks/:taskId/comments', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), PerformTaskController.createComment)

router.patch('/process/tasks/:taskId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), PerformTaskController.editComment)

router.delete('/process/tasks/:taskId/comments/:commentId', auth, PerformTaskController.deleteComment)

router.patch('/process/tasks/:taskId/comments/:commentId/files/:fileId', auth, PerformTaskController.deleteFileComment)


// Child comments

router.post('/process/tasks/:taskId/comments/:commentId/child-comments', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), PerformTaskController.createChildComment)

router.patch('/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', auth, uploadFile([{ name: 'files', path: '/files/taskprocess' }], 'array'), PerformTaskController.editChildComment)

router.delete('/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId', auth, PerformTaskController.deleteChildComment)

router.patch('/process/tasks/:taskId/comments/:commentId/child-comments/:childCommentId/files/:fileId', auth, PerformTaskController.deleteFileChildComment)


// Project task evaluation

router.post('/tasks/:taskId/evaluate-project', auth, PerformTaskController.evaluateTaskProject);

// TaskOutputs
router.post('/tasks/:taskId/task-outputs/:taskOutputId/submissionResults', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createSubmissionResults);
router.patch('/tasks/:taskId/task-outputs/:taskOutputId/submissionResults', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editSubmissionResults);
router.delete('/tasks/:taskId/task-outputs/:taskOutputId/submissionResults', auth, PerformTaskController.deleteSubmissionResults);
router.patch('/tasks/:taskId/task-outputs', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editTaskOutputs);

router.patch('/tasks/:taskId/task-outputs/:taskOutputId/documents/:fileId', auth, PerformTaskController.deleteFileOfTaskOutput);
router.get('/tasks/:taskId/task-outputs', auth, PerformTaskController.getTaskOutputs);
router.patch('/tasks/:taskId/task-outputs/:taskOutputId/approve', auth, PerformTaskController.approveTaskOutputs);

router.post('/tasks/:taskId/task-outputs/:taskOutputId/comments', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.createCommentOfTaskOutput);
router.patch('/tasks/:taskId/task-outputs/:taskOutputId/comments/:commentId', auth, uploadFile([{ name: 'files', path: '/files/actions' }], 'array'), PerformTaskController.editCommentOfTaskOutput);

module.exports = router;