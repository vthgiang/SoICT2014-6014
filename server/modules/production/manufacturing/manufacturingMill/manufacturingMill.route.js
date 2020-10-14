const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const ManufacturingController = require('./manufacturingMill.controller');

router.post('/', auth, ManufacturingController.createManufacturingMill);
router.post('/add-work-schedule/:id', auth, ManufacturingController.createWorkSchedule);
router.post('/add-manufacturing-command-to-schedule/:id', auth, ManufacturingController.addCommandToSchedule);

module.exports = router;