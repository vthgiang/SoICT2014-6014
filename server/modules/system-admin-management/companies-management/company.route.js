const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, CompanyController.get);
router.post("/paginate", auth, CompanyController.getPaginate);
router.post("/", auth, CompanyController.create);
router.get("/:id", auth, CompanyController.show);
router.patch("/:id", auth, CompanyController.edit);
router.delete("/:id", auth, CompanyController.delete);
router.get("/:id/links", auth, CompanyController.getLinksOfCompany);

module.exports = router;
