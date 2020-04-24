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

router.get('/log-timer/:task', PerformTaskController.getLogTimer);
router.get('/log-timer/currentTimer/:task/:user', auth, PerformTaskController.getTimerStatus);
router.post('/log-timer/start-timer', PerformTaskController.startTimer);
router.put('/log-timer/pause-timer/:id', PerformTaskController.pauseTimer);
router.put('/log-timer/continue-timer/:id', PerformTaskController.continueTimer);
router.put('/log-timer/stop-timer/:id', PerformTaskController.stopTimer);
router.delete('/task-action/:id',PerformTaskController.deleteTaskAction);
router.get('/action-comment/:task', PerformTaskController.getActionComments);
router.post('/action-comment/create', PerformTaskController.createActionComment);//,upload.single('file')
router.put('/action-comment/:id', PerformTaskController.editActionComment);
router.put('/task-action/:id',PerformTaskController.editTaskAction)
router.delete('/action-comment/:id', PerformTaskController.deleteActionComment);
router.get('/task-action/:task',PerformTaskController.getTaskActions);
router.post('/task-action/create',PerformTaskController.createTaskAction)
router.post('/add-result/create', PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create', PerformTaskController.createResultInformationTask);
router.put('/information-task-template', PerformTaskController.editResultInformationTask);
router.post('/result-task/create',auth, PerformTaskController.createResultTask);
router.put('/result-task/:id', auth, PerformTaskController.editResultTask);


module.exports = router;