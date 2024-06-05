const express = require('express');
const router = express.Router();
const OrderController = require('./order.controller');
const { auth } = require(`../../../middleware`);

router.post('/create-order', auth, OrderController.createOrder);
router.get('/orders', auth, OrderController.getAllOrder);

module.exports = router;
