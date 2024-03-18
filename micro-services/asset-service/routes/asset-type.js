const express = require('express');
const router = express.Router();
const {auth} = require('../middleware');
const controllers = require('../controllers');


router.get('/asset-types', auth, controllers.ASSET_TYPE.getAssetTypes);


router.post('/asset-types', auth, controllers.ASSET_TYPE.createAssetTypes);
router.post('/asset-types/imports', auth, controllers.ASSET_TYPE.importAssetTypes);

router.patch('/asset-types/:id', auth, controllers.ASSET_TYPE.editAssetType);
router.delete('/asset-types/:id', auth, controllers.ASSET_TYPE.deleteAssetTypes);


router.delete('/asset-types', auth, controllers.ASSET_TYPE.deleteManyAssetType);


module.exports = router;
