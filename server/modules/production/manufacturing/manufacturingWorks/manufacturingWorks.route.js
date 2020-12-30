const express = require('express');
const router = express.Router();
const ManufacturingWorksController = require('./manufacturingWorks.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, ManufacturingWorksController.createManufacturingWorks);
router.get('/', auth, ManufacturingWorksController.getAllManufacturingWorks);
router.get('/:id', auth, ManufacturingWorksController.getManufacturingWorksById);
router.delete('/:id', auth, ManufacturingWorksController.deleteManufacturingWorks);
router.patch('/:id', auth, ManufacturingWorksController.editManufacturingWorks);

module.exports = router;

