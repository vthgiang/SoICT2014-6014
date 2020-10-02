const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);
const StockController = require('./stock.controller');

router.get('/', auth, StockController.getAllStocks);
router.post('/', auth, StockController.createStock);
router.patch('/:id', auth, StockController.editStock);
router.delete('/:id', auth, StockController.deleteStock);

module.exports = router;