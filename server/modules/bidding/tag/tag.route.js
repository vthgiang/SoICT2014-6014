const express = require("express");
const router = express.Router();

const TagController = require("./tag.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/tag", auth, TagController.searchTag);

router.post("/tag", auth, TagController.createNewTag);

router.patch("/tag/:id", auth, TagController.editTag);
router.delete("/tag/:id", auth, TagController.deleteTag);

module.exports = router;
