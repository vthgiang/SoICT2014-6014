const express = require('express');
const router = express.Router();
const OntimePredictController = require('./ontimePredict.controller');
const { auth } = require(`../../../middleware`);

router.get('/ontimeRate', auth, OntimePredictController.getOnTimeDeliveryRates);
router.get('/ontimeRatePerMonth', auth, OntimePredictController.getOnTimeDeliveryRatesPerMonth);
router.get('/estimatedOntimeRate', auth, OntimePredictController.getEstimatedOnTimeDeliveryRates);
router.get('/estimatedOntimeRatePerMonth', auth, OntimePredictController.getEstimatedOnTimeDeliveryRatesPerMonth);
router.get('/deliveryLateDayAverage', auth, OntimePredictController.getDeliveryLateDayAverage);
router.get('/deliveryLateDayAveragePerMonth', auth, OntimePredictController.getDeliveryLateDayAveragePerMonth);
router.get('/predict/:scheduleId', auth, OntimePredictController.predictOnTimeDelivery);

module.exports = router;
