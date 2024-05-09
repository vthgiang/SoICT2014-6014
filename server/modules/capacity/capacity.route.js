const express = require("express");
const router = express.Router();
const CapacityController = require('./capacity.controller')
const { auth } = require('../../middleware')

router.get('/', auth, CapacityController.getListCapacities)

module.exports = router