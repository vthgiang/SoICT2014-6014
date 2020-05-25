const express = require("express");
const router = express.Router();
const multer = require('multer');
const {auth,uploadFile} = require('../../../middleware');
const PerformTaskController = require("./taskPerform.controller");

router.get('/log-timer/:task',auth,  PerformTaskController.getTaskTimesheetLogs);
router.get('/log-timer/currentTimer/:task/:user', auth, PerformTaskController.getActiveTimesheetLog);
// router.post('/log-timer/start-timer',  PerformTaskController.startTimesheetLog);
router.post('/log-timer/stop-timer',  PerformTaskController.stopTimesheetLog);
router.post('/add-result/create',auth,  PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create',auth,  PerformTaskController.createTaskInformation);
router.put('/information-task-template',auth,  PerformTaskController.editTaskInformation);
//result task
router.post('/result-task/create',auth, PerformTaskController.createTaskResult);
router.put('/result-task/:id', auth, PerformTaskController.editTaskResult);
//task action
router.post('/task-action/create',auth, uploadFile([{name:'files', path:'/files'}], 'array'), PerformTaskController.createTaskAction)
router.get('/task-action',auth, PerformTaskController.getTaskActions);
router.put('/task-action',auth, PerformTaskController.editTaskAction);
router.delete('/task-action/:task/:id',auth, PerformTaskController.deleteTaskAction);
//comment of task action
router.post('/action-comment/create',auth,  PerformTaskController.createCommentOfTaskAction);
router.put('/action-comment/:id',auth,  PerformTaskController.editCommentOfTaskAction);
router.delete('/action-comment/:task/:id',auth,  PerformTaskController.deleteCommentOfTaskAction);
//task comment
router.post('/task-comment/create',auth,PerformTaskController.createTaskComment);
router.get('/task-comment/:task',auth,PerformTaskController.getTaskComments);
router.put('/task-comment/:id',auth,PerformTaskController.editTaskComment);
router.delete('/task-comment/:task/:id',auth,PerformTaskController.deleteTaskComment);
//comment of task comment
router.post('/task-comment/comment/create',auth,PerformTaskController.createCommentOfTaskComment);
router.put('/task-comment/comment/:id',auth,PerformTaskController.editCommentOfTaskComment);
router.delete('/task-comment/comment/:id/:task',auth,PerformTaskController.deleteCommentOfTaskComment);

module.exports = router;