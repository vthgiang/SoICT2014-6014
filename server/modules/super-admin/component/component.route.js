const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth, authFunc } = require('../../../middleware');

router.get("/components", auth, ComponentController.getComponents);
router.get("/components/:id", auth, ComponentController.getComponent);

router.post("/components", auth, ComponentController.createComponent);

router.patch("/components/:id", auth, ComponentController.editComponent);

router.delete("/components/:id", auth, ComponentController.deleteComponent);

module.exports = router;
