const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require("../../../middleware");

const BiddingContractController = require("./biddingContract.controller");

router.get("/bidding-contract", auth, BiddingContractController.searchBiddingContract);

router.post("/bidding-contract", auth, uploadFile([{ name: 'files', path: '/bidding-contracts' }], 'array'), BiddingContractController.createNewBiddingContract);

router.patch("/bidding-contract/:id", auth, uploadFile([{ name: 'files', path: '/bidding-contracts' }], 'array'), BiddingContractController.editBiddingContract);
router.delete("/bidding-contract/:id", auth, BiddingContractController.deleteBiddingContract);


router.patch("/bidding-contract/:id/upload", auth, uploadFile([{ name: 'files', path: '/bidding-contracts' }], 'single'), BiddingContractController.uploadBiddingContractFile);

module.exports = router;
