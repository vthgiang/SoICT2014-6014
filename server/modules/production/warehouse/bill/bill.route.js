const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const BillController = require('./bill.controller');

router.get('/', auth, BillController.getBillsByType);
router.get('/get-bill-by-good', auth, BillController.getBillByGood);
router.get('/get-detail-bill/:id', auth, BillController.getDetailBill);

module.exports = router