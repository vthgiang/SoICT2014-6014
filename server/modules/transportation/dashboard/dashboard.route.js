const express = require('express');
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const { auth } = require(`../../../middleware`);

router.get('/ontimeRate', auth, DashboardController.getOnTimeDeliveryRates);
router.get('/estimatedOntimeRate', auth, DashboardController.getEstimatedOnTimeDeliveryRates);

module.exports = router;