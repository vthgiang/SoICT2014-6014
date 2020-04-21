const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, LinkController.getAllLinks);
router.post("/paginate", auth, LinkController.getPaginatedLinks);
router.post("/", auth, LinkController.createLink);
router.get("/:id", auth, LinkController.getLinkById);
router.patch("/:id", auth, LinkController.editLink);
router.delete("/:id", auth, LinkController.deleteLink);

//manage link of 1 company
router.get("/company/:idCompany", auth, LinkController.getLinksOfCompany);

module.exports = router;
