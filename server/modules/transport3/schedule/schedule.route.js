const express = require('express');
const router = express.Router();
const ScheduleController = require('./schedule.controller');
const { auth } = require(`../../../middleware`);

router.get('/schedule', auth, ScheduleController.getAllSchedule);
router.post('/schedule', auth, ScheduleController.createSchedule);
router.delete('/schedule/:id', auth, ScheduleController.deleteSchedule);
router.put('/schedule/:id', auth, ScheduleController.updateSchedule);
router.get('/schedule/transporting', auth, ScheduleController.getOrdersTransporting);
router.get('/schedule/me', auth, ScheduleController.getMySchedule);

module.exports = router;
