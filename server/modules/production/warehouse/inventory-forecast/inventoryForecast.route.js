const express = require('express');
const router = express.Router();
const forecastController = require('./inventoryForecast.controller');
const { auth } = require(`../../../../middleware`);


router.get('/', auth, forecastController.getAllForecasts);
router.post('/', auth, forecastController.createForecast);
// router.get('/:id',auth, forecastController.getForecastById);

module.exports = router;
