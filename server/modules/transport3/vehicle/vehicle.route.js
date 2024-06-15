const express = require('express');
const router = express.Router();
const VehicleController = require('./vehicle.controller');
const {auth} = require(`../../../middleware`);

router.get('/vehicles', auth, VehicleController.getAllVehicleTransport3);
router.put('/vehicles/:id', auth, VehicleController.editVehicleTransport3);
router.get('/vehicles/transporting', auth, VehicleController.getVehicleTransporting);
module.exports = router;
