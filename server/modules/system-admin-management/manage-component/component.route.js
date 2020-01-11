const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/", auth, ComponentController.get);
router.post("/", auth, ComponentController.create);
router.get("/:id", auth, ComponentController.show);
router.patch("/:id", auth, ComponentController.edit);
router.delete("/:id", auth, ComponentController.delete);

module.exports = router;
