const express = require('express');
const router = express.Router();
const salesOrderController = require('./salesOrder.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/', auth, salesOrderController.getAllSalesOrders);
module.exports = router;