const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth } = require('../../../middleware');


router.get("/components", auth, ComponentController.getComponents);


router.post("/components", auth, ComponentController.createComponent);
router.get("/components/:id", auth, ComponentController.getComponent);
router.patch("/components/:id", auth, ComponentController.editComponent);
router.delete("/components/:id", auth, ComponentController.deleteComponent);


module.exports = router;
