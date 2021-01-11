const express = require('express');
const router = express.Router();
const SalesOrderController = require('./salesOrder.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth,  SalesOrderController.createNewSalesOrder);
router.patch('/:id', auth, SalesOrderController.editSalesOrder);
router.patch('/approve/:id', auth,  SalesOrderController.approveSalesOrder);
router.patch('/add-manufacturing-plan/:id', auth,  SalesOrderController.addManufacturingPlanForGood)
router.get('/get-for-payment', auth, SalesOrderController.getSalesOrdersForPayment)

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/', auth,  SalesOrderController.getAllSalesOrders);
router.get('/get-by-manufacturing-works', auth,  SalesOrderController.getSalesOrdersByManufacturingWorks)
module.exports = router;