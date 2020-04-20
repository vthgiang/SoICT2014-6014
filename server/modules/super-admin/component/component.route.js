const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, ComponentController.getAllComponents);
router.post("/paginate", auth, ComponentController.getPaginatedComponents);
router.post("/", auth, ComponentController.createComponent);
router.get("/:id", auth, ComponentController.getComponentById);
router.patch("/:id", auth, ComponentController.editComponent);
router.delete("/:id", auth, ComponentController.deleteComponent);

//Lấy tất cả các component của user trên trang web tương ứng với role hiện tại của user
router.get("/role/:roleId/link/:linkId", auth, ComponentController.getComponentsOfUserInLink);

module.exports = router;
