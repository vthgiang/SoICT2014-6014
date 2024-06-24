const express = require('express');
const router = express.Router();
const forecastController = require('./salesForecast.controller');
const { auth } = require(`../../../../../middleware`);


// router.post('/forecast', forecastController.getForecast);
router.get('/', auth, forecastController.getAllForecasts);
router.get('/:id',auth, forecastController.getForecastById);

module.exports = router;

