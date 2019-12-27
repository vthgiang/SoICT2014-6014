const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');

router.get("/", ComponentController.get);
router.get("/company/:id", ComponentController.getComponentOfCompany);
router.post("/", ComponentController.create);
router.get("/:id", ComponentController.show);
router.patch("/:id", ComponentController.edit);
router.delete("/:id", ComponentController.delete);

module.exports = router;
