const express = require('express');
const router = express.Router();
const ScheduleController = require('./schedule.controller');
const { auth } = require(`../../../middleware`);

router.get('/schedule/nearest-depot', auth, ScheduleController.getNearestDepot);
module.exports = router;
