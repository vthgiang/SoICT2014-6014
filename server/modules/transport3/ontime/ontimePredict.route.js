const express = require('express');
const router = express.Router();
const OntimePredictController = require('./ontimePredict.controller');
const { auth } = require(`../../../middleware`);

router.get('/ontimeRate', auth, OntimePredictController.getOnTimeDeliveryRates);
router.get('/estimatedOntimeRate', auth, OntimePredictController.getEstimatedOnTimeDeliveryRates);
router.get('/deliveryLateDayAverage', auth, OntimePredictController.getDeliveryLateDayAverage);

module.exports = router;