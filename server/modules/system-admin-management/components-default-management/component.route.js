const express = require("express");
const router = express.Router();
const ComponentController = require('./component.controller');
const { auth } = require('../../../middleware');
const { validation } = require('./component.validation');

router.get("/", auth, ComponentController.get);
router.post("/paginate", auth, ComponentController.getPaginate);
router.post("/", auth, validation, ComponentController.create);
router.get("/:id", auth, ComponentController.show);
router.patch("/:id", auth, validation, ComponentController.edit);
router.delete("/:id", auth, ComponentController.delete);

//Lấy tất cả các component của user trên trang web tương ứng với role hiện tại của user
router.get("/role/:roleId/link/:linkId", auth, ComponentController.getComponentsOfUserInLink);

module.exports = router;
