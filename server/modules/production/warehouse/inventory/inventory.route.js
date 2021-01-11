const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);;
const LotController = require('./inventory.controller');

router.get('/', auth, LotController.getAllLots);
router.get('/get-inventory-dashboard', auth, LotController.getInventories);
router.get('/get-lot-by-good', auth, LotController.getLotsByGood);
router.post('/create-or-edit-lot', auth, LotController.createOrUpdateLots);
router.post('/delete-many', auth, LotController.deleteManyLots);
router.get('/get-inventory', auth, LotController.getInventoryByGoods);
router.get('/get-detail/:id', auth, LotController.getDetailLot);
router.patch('/:id', auth, LotController.editLot);

//Tạo lô sản xuất, Hàm này sẽ tạo một lúc hai lô (lô thành phẩm và lô phế phẩm)
router.post('/create-manufacturing-lot', auth, LotController.createManufacturingLot);
//Lấy ra tất cả các lô sản xuất
router.get('/get-manufacturing-lot', auth, LotController.getAllManufacturingLot);
router.get('/get-manufacturing-lot/:id', auth, LotController.getDetailManufacturingLot);

module.exports = router