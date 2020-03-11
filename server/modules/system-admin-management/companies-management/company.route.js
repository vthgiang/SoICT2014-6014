const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');
const { auth } = require('../../../middleware/auth.middleware');
const { createValidation} = require('./company.validation');

router.get("/", auth, CompanyController.get);
router.post("/paginate", auth, CompanyController.getPaginate);
router.post("/", auth, createValidation, CompanyController.create);
router.get("/:id", auth, CompanyController.show);
router.patch("/:id", auth, CompanyController.edit);
router.delete("/:id", auth, CompanyController.delete);

module.exports = router;
