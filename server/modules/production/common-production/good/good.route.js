const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const GoodController = require('./good.controller');

router.get('/', auth, GoodController.getGoodsByType);
router.get('/all-goods', auth, GoodController.getAllGoods);
router.get('/by-type', auth, GoodController.getAllGoodsByType);
router.post('/', auth, GoodController.createGoodByType);
router.patch('/:id', auth, GoodController.editGood);
router.get('/:id', auth, GoodController.getGoodDetail);
router.get('/by-category/:id', auth, GoodController.getAllGoodsByCategory);
router.delete('/:id', auth, GoodController.deleteGood);

// Lấy tất cả sản phẩm theo id role Quản đốc truyền vào
router.get('/by-manage-works-role/role/:id', auth, GoodController.getGoodByManageWorksRole)
// Lấy tất cả nhà máy theo id sản phẩm
router.get('/get-works-by-product-id/:id', auth, GoodController.getManufacturingWorksByProductId)

module.exports = router;