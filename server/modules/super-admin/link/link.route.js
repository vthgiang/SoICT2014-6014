const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require('../../../middleware');

router.get("/links", auth, LinkController.getLinks);
router.get("/links/:id", auth, LinkController.getLink);

router.post("/links", auth, LinkController.createLink);

router.patch("/links/:id", auth, LinkController.editLink);

router.delete("/links/:id", auth, LinkController.deleteLink);

module.exports = router;
