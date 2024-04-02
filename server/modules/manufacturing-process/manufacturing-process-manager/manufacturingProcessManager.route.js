const express = require('express')
const router = express.Router();

const ManufacturingProcessController = require('./manufacturingProcessManager.controller');
const { auth } = require(`../../../middleware`);

router.get('/', auth, ManufacturingProcessController.getAllManufacturingProcess)
router.get('/:id', auth, ManufacturingProcessController.getManufacturingProcessById)
router.post('/', auth, ManufacturingProcessController.createManufacturingProcess)
router.patch('/:id', auth, ManufacturingProcessController.editManufacturingProcess)
router.delete('/:id', auth, ManufacturingProcessController.deleteManufacturingProcess)


module.exports = router;