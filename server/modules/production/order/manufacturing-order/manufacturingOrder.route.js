const express = require('express');
const router = express.Router();
const manufacturingOrderController = require('./manufacturingOrder.controller');
const { auth } = require(`../../../../middleware`);


module.exports = router;