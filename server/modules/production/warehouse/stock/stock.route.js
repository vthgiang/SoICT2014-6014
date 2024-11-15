const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const StockController = require('./stock.controller');

router.get('/', auth, StockController.getAllStocks);
router.post('/', auth, StockController.createStock);
router.get('/stock-detail/:id', auth, StockController.getStock);
router.patch('/:id', auth, StockController.editStock);
router.delete('/:id', auth, StockController.deleteStock);
router.post('/imports', auth, StockController.importStocks);

module.exports = router;
