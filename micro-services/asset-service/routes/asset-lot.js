const express = require('express');
const router = express.Router();
const {auth, uploadFile} = require('../middleware');
const controllers = require('../controllers');
const data = [{
    name: 'file',
    path: '/assetLot/files'
}]

router.get('/asset-lots', auth, controllers.ASSET_LOT.searchAssetLots);
router.get('/asset-lots/:id', auth, controllers.ASSET_LOT.getAssetLotInforById);
router.post('/asset-lots', auth, uploadFile(data, 'fields'), controllers.ASSET_LOT.createAssetLot);
router.patch('/asset-lots/:id', auth, uploadFile(data, 'fields'), controllers.ASSET_LOT.updateAssetLot);
router.delete('/asset-lots', auth, controllers.ASSET_LOT.deleteAssetLots);

module.exports = router;

