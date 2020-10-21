const express = require('express');
const router = express.Router();
const SLAController = require('./sla.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


module.exports = router;