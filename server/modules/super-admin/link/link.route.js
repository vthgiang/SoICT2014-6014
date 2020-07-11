const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, LinkController.getAllLinks);
router.post("/", auth, LinkController.createLink);
router.get("/:id", auth, LinkController.getLink);
router.patch("/:id", auth, LinkController.editLink);
router.delete("/:id", auth, LinkController.deleteLink);

module.exports = router;
