const express = require('express');
const router = express.Router();
const ManufacturingQualityInspections = require('./manufacturingQualityInspection.controller');
const { auth } = require('../../../../../middleware');

router.get('/', auth, ManufacturingQualityInspections.getAllManufacturingQualityInspections);
router.post('/', auth, ManufacturingQualityInspections.createManufacturingQualityInspection);
router.get('/numberOfInspections', auth, ManufacturingQualityInspections.getNumberCreatedInspection);

module.exports = router;

