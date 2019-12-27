const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');

router.get("/", CompanyController.get);
router.post("/", CompanyController.create);
router.get("/:id", CompanyController.show);
router.patch("/:id", CompanyController.edit);
router.delete("/:id", CompanyController.delete);

module.exports = router;
