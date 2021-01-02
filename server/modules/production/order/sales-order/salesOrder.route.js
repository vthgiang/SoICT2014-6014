const express = require('express');
const router = express.Router();
const SalesOrderController = require('./salesOrder.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', SalesOrderController.createNewSalesOrder);
router.patch('/:id', SalesOrderController.editSalesOrder);
router.patch('/approve/:id', SalesOrderController.approveSalesOrder);
router.patch('/add-manufacturing-plan/:id', SalesOrderController.addManufacturingPlanForGood)

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/', SalesOrderController.getAllSalesOrders);
router.get('/get-by-manufacturing-works', SalesOrderController.getSalesOrdersByManufacturingWorks)
module.exports = router;