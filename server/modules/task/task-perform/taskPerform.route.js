const express = require("express");
const router = express.Router();
const multer = require('multer');
const {auth,uploadFile} = require('../../../middleware');
const PerformTaskController = require("./taskPerform.controller");

router.get('/log-timer/:task',auth,  PerformTaskController.getTaskTimesheetLogs);
router.get('/log-timer/currentTimer/:user', auth, PerformTaskController.getActiveTimesheetLog);
router.post('/log-timer/start-timer',  PerformTaskController.startTimesheetLog);
router.post('/log-timer/stop-timer',  PerformTaskController.stopTimesheetLog);
router.post('/add-result/create',auth,  PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create',auth,  PerformTaskController.createTaskInformation);
router.put('/information-task-template',auth,  PerformTaskController.editTaskInformation);
router.post('/logs/history', auth,  PerformTaskController.addTaskLog);
router.get('/logs/:id',auth,  PerformTaskController.getTaskLog);
//result task
router.post('/:task',auth,uploadFile([{name:'files', path:'/files'}], 'array'),PerformTaskController.uploadFile)
router.post('/result-task/create',auth, PerformTaskController.createTaskResult);
router.put('/result-task/:id', auth, PerformTaskController.editTaskResult);
//task action
router.get('/task-action/:id/:idUser',auth,PerformTaskController.confirmAction)
router.post('/task-action/create',auth, uploadFile([{name:'files', path:'/files/actions'}], 'array'), PerformTaskController.createTaskAction)
router.put('/task-action',auth, PerformTaskController.editTaskAction);
router.delete('/task-action/:task/:id',auth, PerformTaskController.deleteTaskAction);
//comment of task action
router.post('/action-comment/create',auth,uploadFile([{name:'files', path:'/files/commentofactions'}], 'array'),  PerformTaskController.createCommentOfTaskAction);
router.put('/action-comment/:id',auth,  PerformTaskController.editCommentOfTaskAction);
router.delete('/action-comment/:task/:id',auth,  PerformTaskController.deleteCommentOfTaskAction);
//task comment
router.post('/task-comment/create',auth,uploadFile([{name:'files', path:'/files/taskcomments'}], 'array'),PerformTaskController.createTaskComment);
router.put('/task-comment/:id',auth,PerformTaskController.editTaskComment);
router.delete('/task-comment/:task/:id',auth,PerformTaskController.deleteTaskComment);
//comment of task comment
router.post('/task-comment/comment/create',auth,uploadFile([{name:'files', path:'/files/commentoftaskcomment'}], 'array'),PerformTaskController.createCommentOfTaskComment);
router.put('/task-comment/comment/:id',auth,PerformTaskController.editCommentOfTaskComment);
router.delete('/task-comment/comment/:id/:task',auth,PerformTaskController.deleteCommentOfTaskComment);
// router.get("/download-file", auth, PerformTaskController.downloadFile);

module.exports = router;