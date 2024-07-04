const express = require('express');
const router = express.Router();
const forecastController = require('./salesForecast.controller');
const { auth } = require(`../../../../../middleware`);

router.post('/', auth, forecastController.createForecast);
router.get('/', auth, forecastController.getAllForecasts);
router.get('/top5', auth, forecastController.getTop5Products);
router.get('/bottom5', auth, forecastController.getBottom5Products);

module.exports = router;
