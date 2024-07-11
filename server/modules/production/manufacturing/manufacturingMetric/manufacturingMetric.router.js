const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const ManufacturingMetric = require('./manufacturingMetric.controller');

router.get('/report-elements', auth, ManufacturingMetric.getAllReportElements);
router.patch('/bulk', auth, ManufacturingMetric.editManufacturingKpis);
router.get('/', auth, ManufacturingMetric.getAllManufacturingKpis);
router.post('/', auth, ManufacturingMetric.createManufacturingKpi);
router.patch('/:id', auth, ManufacturingMetric.editManufacturingKpi);
router.get('/detail', auth, ManufacturingMetric.getManufacturingKpiById);


module.exports = router;
