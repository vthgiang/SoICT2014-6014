const express = require('express');
const router = express.Router();
const TaxController = require('./tax.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


module.exports = router;