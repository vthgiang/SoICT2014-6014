const express = require("express");
const router = express.Router();
const SystemLinkControllers = require('./systemLink.controller');
const { auth } = require('../../../middleware');

//Lấy tất cả các link mặc đinh sẽ tạo cho 1 doanh nghiệp
router.get("/", auth, SystemLinkControllers.getAllSystemLinks);

//Lấy tất cả các category link mặc định
router.get("/categories", auth, SystemLinkControllers.getAllSystemLinkCategories);

//tạo một link mặc định mới
router.post("/", auth, SystemLinkControllers.createSystemLink);

//lấy thông tin về 1 link mặc định nào đó
router.get("/:id", auth, SystemLinkControllers.getSystemLink);

//sửa thông tin link mặc định
router.patch("/:id", auth, SystemLinkControllers.editSystemLink);

//xóa link mặc định
router.delete("/:id", auth, SystemLinkControllers.deleteSystemLink);

module.exports = router;
