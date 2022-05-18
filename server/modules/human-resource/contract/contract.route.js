const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require("../../../middleware");

const ContractController = require("./contract.controller");

router.get("/contract", auth, ContractController.searchContract);

router.post("/contract", auth, ContractController.createNewContract);

router.patch("/contract/:id", auth, ContractController.editContract);
router.delete("/contract/:id", auth, ContractController.deleteContract);


router.patch("/contract/:id/upload", auth, uploadFile([{ name: 'contract', path: '/contracts' }], 'single'), ContractController.uploadContractFile);

module.exports = router;
