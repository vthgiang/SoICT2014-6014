const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');
const AssetTypeController = require("./asset-type.controller");



router.post('/paginate', auth, AssetTypeController.searchAssetTypes);
router.get("/types", auth, AssetTypeController.getAssetTypes);


router.get('/checkTypeNumber/:typeNumber', auth, AssetTypeController.checkTypeNumber);




router.post("/types", auth, AssetTypeController.createAssetTypes);



router.patch("/types/:id", auth, AssetTypeController.editAssetType);



router.delete("/types/:id", auth, AssetTypeController.deleteAssetTypes);

router.post("/types/delete-many", auth, AssetTypeController.deleteManyAssetType);



module.exports = router;
