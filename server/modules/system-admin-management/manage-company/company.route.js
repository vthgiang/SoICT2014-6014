const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/", auth, CompanyController.get);
router.post("/", auth, CompanyController.create);
router.get("/:id", auth, CompanyController.show);
router.patch("/:id", auth, CompanyController.edit);
router.delete("/:id", auth, CompanyController.delete);

module.exports = router;
