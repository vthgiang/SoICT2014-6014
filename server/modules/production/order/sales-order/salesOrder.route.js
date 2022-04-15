const express = require('express');
const router = express.Router();
const SalesOrderController = require('./salesOrder.controller');
const { auth } = require(`../../../../middleware`);


router.get('/get-number-works-sales-order', auth, SalesOrderController.getNumberWorksSalesOrder);
router.post('/', auth, SalesOrderController.createNewSalesOrder);
router.patch('/:id', auth, SalesOrderController.editSalesOrder);
router.get('/:id', auth, SalesOrderController.getSalesOrderDetail);
router.patch('/approve/:id', auth, SalesOrderController.approveSalesOrder);
router.patch('/add-manufacturing-plan/:id', auth, SalesOrderController.addManufacturingPlanForGood)
router.get('/get-for-payment', auth, SalesOrderController.getSalesOrdersForPayment)

/** Dashboard: Số đơn kinh doanh và doanh số*/
router.get('/count', auth, SalesOrderController.countSalesOrder);

/** Dashboard: Top sản phẩm bán chạy theo số lượng */
router.get('/get-top-good-sold', auth, SalesOrderController.getTopGoodsSold);

/** Dashboard: Doanh số bán hàng từng đơn vị */
router.get('/get-sales-for-departments', auth, SalesOrderController.getSalesForDepartments);

router.get('/', auth, SalesOrderController.getAllSalesOrders);

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/get-by-manufacturing-works/:id', auth, SalesOrderController.getSalesOrdersByManufacturingWorks)
module.exports = router;