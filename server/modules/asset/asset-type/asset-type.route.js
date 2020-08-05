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

// Danh mục văn bản - domain
router.get("/types", auth, AssetTypeController.getAssetTypes);
// router.get("/types/:id", auth, AssetTypeController.showAssetType);
router.post("/types", auth, AssetTypeController.createAssetTypes);
router.post("/types/delete-many", auth, AssetTypeController.deleteManyAssetType);
router.patch("/types/:id", auth, AssetTypeController.editAssetType);
router.delete("/types/:id", auth, AssetTypeController.deleteAssetTypes);