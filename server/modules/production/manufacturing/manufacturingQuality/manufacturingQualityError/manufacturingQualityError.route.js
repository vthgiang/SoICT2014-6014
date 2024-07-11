const express = require('express');
const router = express.Router();
const ManufacturingQualityErrorController = require('./manufacturingQualityError.controller');
const { auth } = require('../../../../../middleware');

router.get('/', auth, ManufacturingQualityErrorController.getAllManufacturingQualityErrors);
router.get('/errorNumByReporter', auth, ManufacturingQualityErrorController.getErrorNumByReporter);
router.get('/errorNumByGroup', auth, ManufacturingQualityErrorController.getErrorNumByGroup);
router.get('/:id', auth, ManufacturingQualityErrorController.getManufacturingQualityErrorById);

module.exports = router;
