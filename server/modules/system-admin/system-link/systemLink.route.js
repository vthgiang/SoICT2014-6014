const express = require("express");
const router = express.Router();
const LinkController = require('./systemLink.controller');
const { auth } = require('../../../middleware');

//Lấy tất cả các link mặc đinh sẽ tạo cho 1 doanh nghiệp
router.get("/", auth, LinkController.getAllSystemLinks);

//Lấy tất cả các category link mặc định
router.get("/categories", auth, LinkController.getAllSystemLinkCategories);

//tạo một link mặc định mới
router.post("/", auth, LinkController.createSystemLink);

//lấy thông tin về 1 link mặc định nào đó
router.get("/:id", auth, LinkController.getSystemLink);

//sửa thông tin link mặc định
router.patch("/:id", auth, LinkController.editSystemLink);

//xóa link mặc định
router.delete("/:id", auth, LinkController.deleteSystemLink);

module.exports = router;
