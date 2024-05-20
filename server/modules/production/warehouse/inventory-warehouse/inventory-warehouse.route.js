const express = require('express');
const router = express.Router();
const InventoryWarehouseController = require('./inventory-warehouse.controller');
const { auth } = require('../../../../middleware');

router.get('/', InventoryWarehouseController.getAllInventories);

module.exports = router;