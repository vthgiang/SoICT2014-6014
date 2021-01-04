const express = require('express');
const router = express.Router();
const WorkScheduleController = require('./workSchedule.controller');
const { auth } = require(`../../../../middleware`);

router.post("/", auth, WorkScheduleController.createWorkSchedule);
router.get("/", auth, WorkScheduleController.getWorkSchedules);

module.exports = router;