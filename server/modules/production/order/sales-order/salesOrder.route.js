const express = require('express');
const router = express.Router();
const SalesOrderController = require('./salesOrder.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, SalesOrderController.createNewSalesOrder);
router.patch('/:id', auth, SalesOrderController.editSalesOrder);
router.patch('/approve/:id', auth, SalesOrderController.approveSalesOrder);
router.patch('/add-manufacturing-plan/:id', auth, SalesOrderController.addManufacturingPlanForGood)
router.get('/get-for-payment', auth, SalesOrderController.getSalesOrdersForPayment)
router.get('/count', auth, SalesOrderController.countSalesOrder);
router.get('/get-top-good-sold', auth, SalesOrderController.getTopGoodsSold);
router.get('/get-sales-for-departments', auth, SalesOrderController.getSalesForDepartments);
router.get('/:id', auth, SalesOrderController.getSalesOrderDetail);
router.get('/', auth, SalesOrderController.getAllSalesOrders);

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/get-by-manufacturing-works/:id', auth, SalesOrderController.getSalesOrdersByManufacturingWorks)
module.exports = router;