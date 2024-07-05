const express = require('express');
const router = express.Router();
const forecastController = require('./inventoryForecast.controller');
const { auth } = require(`../../../../middleware`);


router.post('/', auth, forecastController.createForecast);
router.get('/', auth, forecastController.getAllForecasts);

module.exports = router;
