const express = require("express");
const router = express.Router();

const biddingPackageController = require("./biddingPackage.controller");
const { auth } = require(`../../../middleware`);


router.get('/bidding-packages', auth, biddingPackageController.searchBiddingPackage);

router.get('/bidding-packages/:id', auth, biddingPackageController.getDetailBiddingPackage);

router.post('/bidding-packages', auth, biddingPackageController.createNewBiddingPackage);

router.patch('/bidding-packages/:id', auth, biddingPackageController.editBiddingPackage);

router.delete('/bidding-packages/:id', auth, biddingPackageController.deleteBiddingPackage);

module.exports = router;
