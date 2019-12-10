const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');

router.get("/", LinkController.get);
router.post("/", LinkController.create);
router.get("/:id", LinkController.show);
router.patch("/:id", LinkController.edit);
router.delete("/:id", LinkController.delete);

//manage link of 1 company
router.get("/company/:idCompany", LinkController.getLinksOfCompany);

module.exports = router;
