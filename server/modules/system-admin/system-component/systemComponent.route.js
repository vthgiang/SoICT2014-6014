const express = require("express");
const router = express.Router();
const SystemComponentControllers = require('./systemComponent.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, SystemComponentControllers.getAllSystemComponents);
router.post("/", auth, SystemComponentControllers.createSystemComponent);
router.get("/:id", auth, SystemComponentControllers.getSystemComponent);
router.patch("/:id", auth, SystemComponentControllers.editSystemComponent);
router.delete("/:id", auth, SystemComponentControllers.deleteSystemComponent);

module.exports = router;
