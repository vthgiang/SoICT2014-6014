const express = require('express');
const router = express.Router();
const ManufacturingQualityInspections = require('./manufacturingQualityInspection.controller');
const { auth } = require('../../../../../middleware');

router.get('/', auth, ManufacturingQualityInspections.getAllManufacturingQualityInspections);
router.post('/', auth, ManufacturingQualityInspections.createManufacturingQualityInspection);

module.exports = router;

