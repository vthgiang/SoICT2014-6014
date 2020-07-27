const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, LinkController.getLinks);
router.get("/:id", auth, LinkController.getLink);

router.post("/", auth, LinkController.createLink);

router.patch("/:id", auth, LinkController.editLink);

router.delete("/:id", auth, LinkController.deleteLink);

module.exports = router;
