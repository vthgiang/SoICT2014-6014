const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require("../../../middleware");
const AssetLotController = require("./asset-lot.controller");
const data = [{
    name: 'file',
    path: '/assetLot/files'
}]

router.get("/asset-lots", auth, AssetLotController.searchAssetLots);
router.post("/asset-lots", auth, uploadFile(data, 'fields'), AssetLotController.createAssetLot)

module.exports = router;

