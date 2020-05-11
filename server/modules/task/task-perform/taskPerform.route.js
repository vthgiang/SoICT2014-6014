const express = require("express");
const router = express.Router();
const multer = require('multer');
const {auth} = require('../../../middleware');
// const {role} = require('../../../middleware/auth.middleware');
const DIR = '../../../../client/public/fileupload/';
const PerformTaskController = require("./taskPerform.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

router.get('/log-timer/:task',auth,  PerformTaskController.getTaskTimesheetLogs);
router.get('/log-timer/currentTimer/:task/:user', auth, PerformTaskController.getActiveTimesheetLog);
router.post('/log-timer/start-timer',auth,  PerformTaskController.startTimesheetLog);
router.put('/log-timer/pause-timer/:id',auth,  PerformTaskController.pauseTimesheetLog);
router.put('/log-timer/continue-timer/:id',auth,  PerformTaskController.continueTimesheetLog);
router.put('/log-timer/stop-timer/:id',auth,  PerformTaskController.stopTimesheetLog);
router.post('/add-result/create',auth,  PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create',auth,  PerformTaskController.createTaskInformation);
router.put('/information-task-template',auth,  PerformTaskController.editTaskInformation);
//result task
router.post('/result-task/create',auth, PerformTaskController.createTaskResult);
router.put('/result-task/:id', auth, PerformTaskController.editTaskResult);
//task action
router.post('/task-action/create', PerformTaskController.createTaskAction)
router.get('/task-action/:task', PerformTaskController.getTaskActions);
router.put('/task-action/:id',auth, PerformTaskController.editTaskAction);
router.delete('/task-action/:task/:id', PerformTaskController.deleteTaskAction);
//comment of task action
router.post('/action-comment/create',auth,  PerformTaskController.createCommentOfTaskAction);//,upload.single('file')
router.put('/action-comment/:id',auth,  PerformTaskController.editCommentOfTaskAction);
router.delete('/action-comment/:task/:id',auth,  PerformTaskController.deleteCommentOfTaskAction);
//task comment
router.post('/task-comment/create',PerformTaskController.createTaskComment);
router.get('/task-comment/:task',PerformTaskController.getTaskComments);
router.put('/task-comment/:id',PerformTaskController.editTaskComment);
router.delete('/task-comment/:task/:id',PerformTaskController.deleteTaskComment);
//comment of task comment
router.post('/task-comment/comment/create',PerformTaskController.createCommentOfTaskComment);
router.put('/task-comment/comment/:id',PerformTaskController.editCommentOfTaskComment);
router.delete('/task-comment/comment/:id/:task',PerformTaskController.deleteCommentOfTaskComment);

module.exports = router;