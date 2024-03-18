const express = require('express');
const router = express.Router();
const DashboardUnitController = require('../controllers')
const { auth } = require('../middleware');

router.get('/all-unit-dashboard-data', auth, DashboardUnitController.getAllUnitDashboardData);

module.exports = router;
