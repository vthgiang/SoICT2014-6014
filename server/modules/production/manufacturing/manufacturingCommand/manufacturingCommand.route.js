const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const ManufacturingCommandController = require('./manufacturingCommand.controller');

router.post('/', auth, ManufacturingCommandController.createManufacturingCommand);
router.get('/', auth, ManufacturingCommandController.getAllManufacturingCommands);
router.get('/:id', auth, ManufacturingCommandController.getManufacturingCommandById);
router.patch('/:id', auth, ManufacturingCommandController.editManufaturingCommand);

module.exports = router;