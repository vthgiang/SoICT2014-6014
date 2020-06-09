const express = require("express");
const router = express.Router();
const {
    auth,
    uploadFile
} = require('../../../middleware');
const AssetController = require("./asset.controller");
const data =[
    {name:'fileAvatar', path:'/human-resource/avatars'},
    {name:'file', path:'/human-resource/files'}
]

/**
 * Lấy danh sách tài sản
 */
router.get('/', auth, AssetController.searchAssetProfiles);

/**
 * Thêm mới một tài sản
 */
router.post('/', auth, uploadFile(data, 'fields'), AssetController.createAsset);

/**
 * Cập nhật thông tin tài sản theo id
 */
router.put('/:id', auth, uploadFile(data, 'fields'), AssetController.updateAssetInformation);

/**
 * Xoá thông tin tài sản
 */
router.delete('/:id', auth, AssetController.deleteAsset);

module.exports = router;