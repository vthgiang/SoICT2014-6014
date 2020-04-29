const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const AssetTypeController = require("./asset-type.controller");

/**
 * Lấy danh sách loại tài sản
 */ 
router.post('/paginate',auth, AssetTypeController.searchAssetTypes);

/**
 * thêm mới loại tài sản
 */ 
router.post('/create',auth, AssetTypeController.createAssetType);

/**
 * Xoá bẳng thông tin loại tài sản
 */
router.delete('/:id',auth, AssetTypeController.deleteAssetType);

/**
 * Cập nhật thông tin loại tài sản
 */
router.put('/:id',auth, AssetTypeController.updateAssetType);

// Kiểm tra sự tồn tại của typeNumber
router.get('/checkTypeNumber/:typeNumber', auth, AssetTypeController.checkTypeNumber);

module.exports = router;

