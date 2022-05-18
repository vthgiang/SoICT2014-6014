const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require("../../../middleware");

const BiddingContractController = require("./biddingContract.controller");

router.get("/bidding-contract", auth, BiddingContractController.searchBiddingContract);

router.post("/bidding-contract", auth, BiddingContractController.createNewBiddingContract);

router.patch("/bidding-contract/:id", auth, BiddingContractController.editBiddingContract);
router.delete("/bidding-contract/:id", auth, BiddingContractController.deleteBiddingContract);


router.patch("/bidding-contract/:id/upload", auth, uploadFile([{ name: 'bidding-contract', path: '/bidding-contracts' }], 'array'), BiddingContractController.uploadBiddingContractFile);

module.exports = router;
