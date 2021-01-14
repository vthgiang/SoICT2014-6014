const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, paymentController.createPayment);
router.get('/', auth, paymentController.getAllPayments);
router.get('/get-for-order', auth, paymentController.getPaymentForOrder);
router.get('/:id', auth, paymentController.getPaymentDetail);

module.exports = router;