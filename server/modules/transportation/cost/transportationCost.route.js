const express = require('express');
const router = express.Router();
const TransportationCost = require('./transportationCost.controller');
const { auth } = require(`../../../middleware`);

router.get('/get/vehicle-cost', auth, TransportationCost.getVehicleCosts);
router.get('/get/shipper-cost', auth, TransportationCost.getShipperCosts);
router.post('/create/vehicle-cost', auth, TransportationCost.createVehicleCost);
router.post('/create/shipper-cost', auth, TransportationCost.createShipperCost);
router.patch('/vehicle/:id', auth, TransportationCost.updateDependentVehicleCost);
router.delete('/vehicle/:id', auth, TransportationCost.deleteVehicleCost)

module.exports = router;