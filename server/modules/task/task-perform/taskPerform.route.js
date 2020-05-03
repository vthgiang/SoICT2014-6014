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
router.delete('/task-action/:id',auth, PerformTaskController.deleteTaskAction);
router.get('/action-comment/:task',auth,  PerformTaskController.getCommentsOfTaskAction);
router.post('/action-comment/create',auth,  PerformTaskController.createCommentOfTaskAction);//,upload.single('file')
router.put('/action-comment/:id',auth,  PerformTaskController.editCommentOfTaskAction);
router.put('/task-action/:id',auth, PerformTaskController.editTaskAction)
router.delete('/action-comment/:id',auth,  PerformTaskController.deleteCommentOfTaskAction);
router.get('/task-action/:task',auth, PerformTaskController.getTaskActions);
router.post('/task-action/create',auth, PerformTaskController.createTaskAction)
router.post('/add-result/create',auth,  PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create',auth,  PerformTaskController.createTaskInformation);
router.put('/information-task-template',auth,  PerformTaskController.editTaskInformation);
router.post('/result-task/create',auth, PerformTaskController.createTaskResult);
router.put('/result-task/:id', auth, PerformTaskController.editTaskResult);
router.post('/task-comment/create',PerformTaskController.createTaskComment);


module.exports = router;