const express = require("express");
const router = express.Router();
const CapacityController = require('./capacity.controller')
const { auth } = require('../../middleware')

router.get('/', CapacityController.getListCapacities)
router.get('/:id', CapacityController.getOneCapacity)
router.post('/', CapacityController.createNewCapacity)
router.patch('/:id', CapacityController.updateCapacity)
router.delete('/:id', CapacityController.deleteCapacity)

module.exports = router
