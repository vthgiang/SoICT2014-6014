const express = require('express');
const router = express.Router();
const purchaseOrderController = require('./purchaseOrder.controller');
const { auth } = require(`../../../../middleware`);

module.exports = router;