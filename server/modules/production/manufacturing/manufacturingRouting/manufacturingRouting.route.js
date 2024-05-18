const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const ManufacturingRoutingController = require('./manufacturingRouting.controller');

router.get('/', auth, ManufacturingRoutingController.getAllManufacturingRoutings);
router.get('/:id', auth, ManufacturingRoutingController.getManufacturingRoutingById);
router.get('/good/:id', auth, ManufacturingRoutingController.getManufacturingRoutingsByGood);
router.get('/:id/resources', auth, ManufacturingRoutingController.getAvailableResources);
router.post('/', auth, ManufacturingRoutingController.createManufacturingRouting);

module.exports = router;
