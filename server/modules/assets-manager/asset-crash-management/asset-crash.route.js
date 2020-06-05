const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const AssetCrashController = require("./asset-crash.controller");

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/paginate',auth, AssetCrashController.searchAssetCrashs);

/**
 * thêm mới phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/create',auth, AssetCrashController.createAssetCrash);

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.delete('/:id',auth, AssetCrashController.deleteAssetCrash);

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.put('/:id',auth, AssetCrashController.updateAssetCrash);

// // Kiểm tra sự tồn tại của mã phiếu
// router.get('/checkDistributeNumber/:distributeNumber', auth, AssetCrashController.checkDistributeNumber);

module.exports = router;