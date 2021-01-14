const express = require('express');
const router = express.Router();
const purchaseOrderController = require('./purchaseOrder.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, purchaseOrderController.createPurchaseOrder);
router.patch('/:id', auth, purchaseOrderController.editPurchaseOrder);
router.get('/', auth, purchaseOrderController.getAllPurchaseOrders);
router.get('/get-for-payment', auth, purchaseOrderController.getPurchaseOrdersForPayment)

module.exports = router;