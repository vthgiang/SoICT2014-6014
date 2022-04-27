const express = require("express");
const router = express.Router();

const biddingPackageController = require("./biddingPackage.controller");
const { auth } = require(`../../../middleware`);

router.get(
    "/bidding-packages",
    auth,
    biddingPackageController.searchBiddingPackage
);

router.get(
    "/bidding-packages/:id",
    auth,
    biddingPackageController.getDetailBiddingPackage
);

router.get(
    "/bidding-packages/:id/edit",
    auth,
    biddingPackageController.getDetailBiddingPackageToEdit
);

router.post(
    "/bidding-packages",
    auth,
    biddingPackageController.createNewBiddingPackage
);

router.patch(
    "/bidding-packages/:id",
    auth,
    biddingPackageController.editBiddingPackage
);

router.delete(
    "/bidding-packages/:id",
    auth,
    biddingPackageController.deleteBiddingPackage
);

router.get(
    "/bidding-packages/:id/document",
    auth,
    biddingPackageController.getBiddingPackageDocument
);

module.exports = router;
