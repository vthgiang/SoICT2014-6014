const express = require("express");
const router = express.Router();
const {auth} = require('../../../middleware');
const AssetController = require("./asset.controller");
const formidable = require("express-formidable");
/**
 * Lấy danh sách tài sản
 */
router.post('/paginate', auth, AssetController.searchAssetProfiles);

// Kiểm tra sự tồn tại của mã tài sản
router.get('/checkCode/:code', auth, AssetController.checkCode);

// Thêm mới một tài sản
router.post('/', auth, formidable(), AssetController.create);

// them file
router.post('/uploadFile', auth, formidable(), AssetController.uploadFileAttachments);

// Cập nhật thông tin tài sản theo id
router.put('/update/:id', auth, AssetController.updateInfoAsset);

// Cập nhật Avatar của tài sản theo mã tài sản
router.patch('/avatar/:code', auth, AssetController.uploadAvatar, AssetController.updateAvatar);

// Cập nhật(thêm) thông tin file đính kèm
router.patch('/file/:code', auth, AssetController.uploadFile, AssetController.updateFile);

// Xoá thông tin tài sản
router.delete('/:id', auth, AssetController.delete);

module.exports = router;
