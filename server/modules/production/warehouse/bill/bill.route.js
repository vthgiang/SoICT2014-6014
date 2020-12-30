const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const BillController = require('./bill.controller');

router.get('/', auth, BillController.getBillsByType);
router.get('/get-bill-by-good', auth, BillController.getBillByGood);
router.get('/get-bill-by-status', auth, BillController.getBillsByStatus);
router.get('/bill-by-command', auth, BillController.getBillsByCommand);
router.post('/', auth, BillController.createBill);
router.patch('/:id', auth, BillController.editBill);
router.get('/get-detail-bill/:id', auth, BillController.getDetailBill);
//Tạo nhiều phiếu nhập thành phẩm
router.post('/create-many-product-bills', auth, BillController.createManyProductBills);


module.exports = router