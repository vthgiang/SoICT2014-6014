const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth, authFunc } = require('../../../middleware');

router.get("/components", auth, ComponentController.getComponents);
router.get("/components/:id", auth, ComponentController.getComponent);
// Lấy tất cả các component của user trên trang web tương ứng với role hiện tại của user
router.get("/role/:roleId/link/:linkId/components", authFunc(false), ComponentController.getComponentsOfUserInLink);

router.post("/components", auth, ComponentController.createComponent);

router.patch("/components/:id", auth, ComponentController.editComponent);

router.delete("/components/:id", auth, ComponentController.deleteComponent);

module.exports = router;
