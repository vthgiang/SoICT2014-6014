const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RecommendProcureController = require("./recommend-procurement.controller");

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */ 
router.post('/paginate',auth, RecommendProcureController.searchRecommendProcures);

/**
 * thêm mới phiếu đề nghị mua sắm thiết bị
 */ 
router.post('/create',auth, RecommendProcureController.createRecommendProcure);

/**
 * Xoá bẳng thông tin phiếu đề nghị mua sắm thiết bị
 */
router.delete('/:id',auth, RecommendProcureController.deleteRecommendProcure);

/**
 * Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
 */
router.put('/:id',auth, RecommendProcureController.updateRecommendProcure);

// Kiểm tra sự tồn tại của mã phiếu
router.get('/checkRecommendNumber/:recommendNumber', auth, RecommendProcureController.checkRecommendNumber);

module.exports = router;