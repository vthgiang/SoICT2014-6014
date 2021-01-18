const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const ManufacturingCommandController = require('./manufacturingCommand.controller');

router.get('/get-number-commands-by-status', auth, ManufacturingCommandController.getNumberCommandsStatus);
router.get('/get-number-commands', auth, ManufacturingCommandController.getNumberCommands);
router.post('/', auth, ManufacturingCommandController.createManufacturingCommand);
router.get('/', auth, ManufacturingCommandController.getAllManufacturingCommands);
router.get('/:id', auth, ManufacturingCommandController.getManufacturingCommandById);
router.patch('/:id', auth, ManufacturingCommandController.editManufaturingCommand);

module.exports = router;