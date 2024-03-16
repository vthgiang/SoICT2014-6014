const express = require('express');
const router = express.Router();
const {
    auth,
    uploadFile
} = require('../middleware');
const controllers = require('../controllers');
const data = [{
    name: 'fileAvatar',
    path: '/asset/pictures'
}, {
    name: 'file',
    path: '/asset/files'
}]

/* Tài sản */
router.get('/assets', auth, controllers.ASSET.searchAssetProfiles);
router.get('/assets-group', auth, controllers.ASSET.getAssetGroupChart);
router.post('/assets', auth, uploadFile(data, 'fields'), controllers.ASSET.createAsset);
router.patch('/assets/:id', auth, uploadFile(data, 'fields'), controllers.ASSET.updateAssetInformation);
router.delete('/assets', auth, controllers.ASSET.deleteAsset);


/* Tab khấu hao */
router.patch('/assets/:id/depreciations', auth, controllers.ASSET.updateDepreciation);


/* Tab thông tin sử dụng */
router.post('/assets/:id/usage-logs', auth, controllers.ASSET.createUsage);
router.patch('/assets/:id/usage-logs', auth, controllers.ASSET.updateUsage);
router.delete('/assets/:id/usage-logs', auth, controllers.ASSET.deleteUsage);


/* Tab bảo trì */
router.get('/assets/maintainance-logs', auth, controllers.ASSET.getMaintainances);
router.post('/assets/:id/maintainance-logs', auth, controllers.ASSET.createMaintainance);
router.patch('/assets/:id/maintainance-logs', auth, controllers.ASSET.updateMaintainance);
router.delete('/assets/:id/maintainance-logs', auth, controllers.ASSET.deleteMaintainance);
router.get('/assets-statistic', auth, controllers.ASSET.getAssetStatisticChart);


/* Tab sự cố */
router.get('/assets/incident-logs', auth, controllers.ASSET.getIncidents);
router.post('/assets/:id/incident-logs', auth, controllers.ASSET.createIncident);
router.patch('/assets/:id/incident-logs', auth, controllers.ASSET.updateIncident);
router.delete('/assets/incident-log', auth, controllers.ASSET.deleteIncident);

module.exports = router;
