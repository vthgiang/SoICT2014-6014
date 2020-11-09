const express = require('express');
const router = express.Router();
const WorkScheduleController = require('./workSchedule.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post("/", auth, WorkScheduleController.createWorkSchedule);
router.get("/", auth, WorkScheduleController.getWorkSchedules);

module.exports = router;