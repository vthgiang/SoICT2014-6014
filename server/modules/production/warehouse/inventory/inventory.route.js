const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);;
const LotController = require('./inventory.controller');

router.get('/', auth, LotController.getAllLots);

module.exports = router