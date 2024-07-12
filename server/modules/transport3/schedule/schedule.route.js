const express = require('express');
const router = express.Router();
const ScheduleController = require('./schedule.controller');
const { auth } = require(`../../../middleware`);

router.get('/schedule/me', auth, ScheduleController.getMySchedule);
router.put('/schedule/update', auth, ScheduleController.updateStatusOrderSchedule);
router.get('/schedule/draft', auth, ScheduleController.getDraftSchedule);
router.post('/schedule/draft', auth, ScheduleController.setScheduleFromDraft);
router.get('/schedule/:id', auth, ScheduleController.getScheduleById);
router.post('/schedule', auth, ScheduleController.createSchedule);
router.delete('/schedule/:id', auth, ScheduleController.deleteSchedule);
router.put('/schedule/:id', auth, ScheduleController.updateSchedule);
router.get('/schedule/transporting', auth, ScheduleController.getOrdersTransporting);
router.get('/schedule', auth, ScheduleController.getAllSchedule);
router.get('/3rdschedule', auth, ScheduleController.getAll3rdSchedule);
router.post('/3rdschedule', auth, ScheduleController.create3rdSchedule);
module.exports = router;
