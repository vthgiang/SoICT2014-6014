const express = require('express');
const router = express.Router();
const OrderController = require('./order.controller');
const { auth } = require(`../../../middleware`);

router.post('/create-order', auth, OrderController.createOrder);
router.get('/orders', auth, OrderController.getAllOrder);
router.put('/order/:id', auth, OrderController.updateOrder);
router.put('/order/approve/:id', auth, OrderController.approveOrder);
router.delete('/order/:id', auth, OrderController.deleteUnapprovedOrder);

module.exports = router;
