const express = require("express");
const router = express.Router();
const {
    auth,
    uploadFile
} = require('../../../middleware');
const AssetController = require("./asset.controller");
const data =[
    {name:'fileAvatar', path:'/asset/pictures'},
    {name:'file', path:'/asset/files'}
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

/**
 * Chỉnh sửa thông tin khấu hao tài sản
 */
router.put('/updateDepreciation/:id', auth,  AssetController.updateDepreciation);

/**
 * Thêm mới thông tin bảo trì cho sự cố
 */
router.put('/createMaintainanceForIncident/:id', auth,  AssetController.createMaintainanceForIncident);

/**
 * Thêm mới thông tin sử dụng tài sản
 */
router.put('/createUsage/:id', auth,  AssetController.createUsage);

/**
 * Chỉnh sửa thông tin sử dụng tài sản
 */
router.put('/updateUsage/:id', auth,  AssetController.updateUsage);

/**
 * Xóa thông tin sử dụng tài sản
 */
router.delete('/deleteUsage/:id', auth,  AssetController.deleteUsage);

/**
 * Thêm mới thông tin bảo trì tài sản
 */
router.put('/createMaintainance/:id', auth,  AssetController.createMaintainance);

/**
 * Chỉnh sửa thông tin bảo trì tài sản
 */
router.put('/updateMaintainance/:id', auth,  AssetController.updateMaintainance);

/**
 * Xóa thông tin bảo trì tài sản
 */
router.delete('/deleteMaintainance/:id', auth,  AssetController.deleteMaintainance);
module.exports = router;

/**
 * Thêm mới thông tin sự cố tài sản
 */
router.put('/createIncident/:id', auth,  AssetController.createIncident);

/**
 * Chỉnh sửa thông tin sự cố tài sản
 */
router.put('/updateIncident/:id', auth,  AssetController.updateIncident);

/**
 * Xóa thông tin sự cố tài sản
 */
router.delete('/deleteIncident/:id', auth,  AssetController.deleteIncident);
