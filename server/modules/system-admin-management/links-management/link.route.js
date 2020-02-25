const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require('../../../middleware/auth.middleware');
const { createValidation } = require('./link.validation');

router.get("/", auth, LinkController.get);
router.post("/paginate", auth, LinkController.getPaginate);
router.post("/", auth, createValidation, LinkController.create);
router.get("/:id", auth, LinkController.show);
router.patch("/:id", auth, LinkController.edit);
router.delete("/:id", auth, LinkController.delete);

//manage link of 1 company
router.get("/company/:idCompany", auth, LinkController.getLinksOfCompany);

module.exports = router;
