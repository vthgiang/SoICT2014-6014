const express = require('express');
const router = express.Router();
const VehicleController = require('./vehicle.controller');
const { auth } = require(`../../../middleware`);

router.get('/vehicles', auth, VehicleController.getAllVehicleTransport3);

module.exports = router;
