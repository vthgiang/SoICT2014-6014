const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/", auth, UserController.get);
router.post("/", auth, UserController.create);
router.get("/:id", auth, UserController.show);
router.patch("/:id", auth, UserController.edit);
router.delete("/:id", auth, UserController.delete);
router.post("/search-by-name", auth, UserController.searchByName);

module.exports = router;
