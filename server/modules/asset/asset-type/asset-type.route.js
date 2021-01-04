const express = require("express");
const router = express.Router();
const { auth } = require("../../../middleware");
const AssetTypeController = require("./asset-type.controller");


router.get("/asset-types", auth, AssetTypeController.getAssetTypes);


router.post("/asset-types", auth, AssetTypeController.createAssetTypes);
router.patch("/asset-types/:id", auth, AssetTypeController.editAssetType);
router.delete("/asset-types/:id", auth, AssetTypeController.deleteAssetTypes);


router.delete("/asset-types", auth, AssetTypeController.deleteManyAssetType);



module.exports = router;
