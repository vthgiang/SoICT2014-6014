const express = require("express");
const router = express.Router();
const ComponentDefaultController = require('./systemComponent.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, ComponentDefaultController.getAllSystemComponents);
router.post("/", auth, ComponentDefaultController.createSystemComponent);
router.get("/:id", auth, ComponentDefaultController.getSystemComponent);
router.patch("/:id", auth, ComponentDefaultController.editSystemComponent);
router.delete("/:id", auth, ComponentDefaultController.deleteSystemComponent);

module.exports = router;
