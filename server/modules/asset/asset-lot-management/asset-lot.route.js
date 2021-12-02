const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require("../../../middleware");
const AssetLotController = require("./asset-lot.controller");
const data = [{
    name: 'file',
    path: '/assetLot/files'
}]

router.get("/asset-lots", auth, AssetLotController.searchAssetLots);
router.post("/asset-lots", auth, uploadFile(data, 'fields'), AssetLotController.createAssetLot);
router.patch('/asset-lots/:id', auth, uploadFile(data, 'fields'), AssetLotController.updateAssetLot);
router.delete('/asset-lots', auth, AssetLotController.deleteAssetLots);

module.exports = router;

