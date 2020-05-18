const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware');
const AssetController = require("./asset.controller");

/**
 * Lấy danh sách tài sản
 */
router.post('/paginate', auth, AssetController.searchAssetProfiles);

// Kiểm tra sự tồn tại của mã tài sản
router.get('/checkAssetNumber/:assetNumber', auth, AssetController.checkAssetNumber);

// Thêm mới một tài sản
router.post('/', auth, AssetController.uploadAvatar, AssetController.create);

// Cập nhật thông tin tài sản theo id
router.put('/update/:id', auth, AssetController.updateInfoAsset);

// Cập nhật Avatar của tài sản theo mã tài sản
router.patch('/avatar/:assetNumber', auth, AssetController.uploadAvatar, AssetController.updateAvatar);

// Cập nhật(thêm) thông tin file đính kèm
router.patch('/file/:assetNumber', auth, AssetController.uploadFile, AssetController.updateFile);

// Xoá thông tin tài sản
router.delete('/:id', auth, AssetController.delete);

module.exports = router;