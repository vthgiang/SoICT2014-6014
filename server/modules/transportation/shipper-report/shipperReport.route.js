const express = require('express');
const router = express.Router();
const ShipperReportController = require('./shipperReport.controller');
const { auth } = require(`../../../middleware`);

router.get('/tasks', auth, ShipperReportController.getAllTaskWithCondition);

module.exports = router;