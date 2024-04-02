const express = require('express');
const router = express.Router();
const TaskPertController = require('./taskPert.controller')
const { auth } = require(`../../../middleware`);
router.get('/', auth,TaskPertController.update);
router.post('/',auth,TaskPertController.updateList)
router.post('/closeProcess',auth,TaskPertController.closeProcess)
router.post('/changeTime',auth,TaskPertController.changeTime)
// router.get('/updateTask',auth,TaskPertController.update)
module.exports = router;