const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RecommendDistributeController = require("./recommend-distribute.controller");

/**
 * Lấy danh sách phiếu đề nghị cap phat thiết bị
 */ 
router.post('/paginate',auth, RecommendDistributeController.searchRecommendDistributes);

/**
 * thêm mới phiếu đề nghị cap phat thiết bị
 */ 
router.post('/create',auth, RecommendDistributeController.createRecommendDistribute);

/**
 * Xoá bẳng thông tin phiếu đề nghị cap phat thiết bị
 */
router.delete('/:id',auth, RecommendDistributeController.deleteRecommendDistribute);

/**
 * Cập nhật thông tin phiếu đề nghị cap phat thiết bị
 */
router.put('/:id',auth, RecommendDistributeController.updateRecommendDistribute);

// Kiểm tra sự tồn tại của mã phiếu
router.get('/checkRecommendNumber/:recommendNumber', auth, RecommendDistributeController.checkRecommendNumber);

module.exports = router;