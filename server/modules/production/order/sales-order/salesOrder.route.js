const express = require('express');
const router = express.Router();
const salesOrderController = require('./salesOrder.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', salesOrderController.createNewSalesOrder);
router.patch('/', salesOrderController.editSalesOrder);
router.patch('/approve', salesOrderController.approveSalesOrder);
router.patch('/add-manufacturing-plan', salesOrderController.addManufacturingPlanForGood)

// API get all đơn kinh doanh phục vụ việc lập kế hoạch
router.get('/', salesOrderController.getAllSalesOrders);
module.exports = router;