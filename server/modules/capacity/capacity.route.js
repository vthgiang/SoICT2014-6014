const express = require("express");
const router = express.Router();
const CapacityController = require('./capacity.controller')
const { auth } = require('../../middleware')

router.get('/', auth, CapacityController.getListCapacities)
router.get('/:id', auth, CapacityController.getOneCapacity)
router.post('/', auth, CapacityController.createNewCapacity)
router.patch('/:id', auth, CapacityController.updateCapacity)
router.delete('/:id', auth, CapacityController.deleteCapacity)

module.exports = router
