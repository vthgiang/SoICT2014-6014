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

router.get('/log-timer/:task',auth,  PerformTaskController.getLogTimer);
router.get('/log-timer/currentTimer/:task/:user', auth, PerformTaskController.getTimerStatus);
router.post('/log-timer/start-timer',auth,  PerformTaskController.startTimer);
router.put('/log-timer/pause-timer/:id',auth,  PerformTaskController.pauseTimer);
router.put('/log-timer/continue-timer/:id',auth,  PerformTaskController.continueTimer);
router.put('/log-timer/stop-timer/:id',auth,  PerformTaskController.stopTimer);
router.delete('/task-action/:id',auth, PerformTaskController.deleteTaskAction);
router.get('/action-comment/:task',auth,  PerformTaskController.getActionComments);
router.post('/action-comment/create',auth,  PerformTaskController.createActionComment);//,upload.single('file')
router.put('/action-comment/:id',auth,  PerformTaskController.editActionComment);
router.put('/task-action/:id',auth, PerformTaskController.editTaskAction)
router.delete('/action-comment/:id',auth,  PerformTaskController.deleteActionComment);
router.get('/task-action/:task',auth, PerformTaskController.getTaskActions);
router.post('/task-action/create',auth, PerformTaskController.createTaskAction)
router.post('/add-result/create',auth,  PerformTaskController.createResultInfoTask);
router.post('/information-task-template/create',auth,  PerformTaskController.createResultInformationTask);
router.put('/information-task-template',auth,  PerformTaskController.editResultInformationTask);
router.post('/result-task/create',auth, PerformTaskController.createResultTask);
router.put('/result-task/:id', auth, PerformTaskController.editResultTask);
router.post('/task-comment/create',PerformTaskController.createTaskComment);


module.exports = router;