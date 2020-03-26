const express = require("express");
const router = express.Router();
const LinkController = require('./link-default.controller');
const { auth } = require('../../../middleware');

//Lấy tất cả các link mặc đinh sẽ tạo cho 1 doanh nghiệp
router.get("/", auth, LinkController.get);

//Lấy giới hạn link mặc đinh sẽ tạo cho 1 doanh nghiệp ( bao nhiêu giá trị / bảng quản lý trang )
router.post("/paginate", auth, LinkController.getPaginate);

//tạo một link mặc định mới
router.post("/", auth, LinkController.create);

//lấy thông tin về 1 link mặc định nào đó
router.get("/:id", auth, LinkController.show);

//sửa thông tin link mặc định
router.patch("/:id", auth, LinkController.edit);

//xóa link mặc định
router.delete("/:id", auth, LinkController.delete);

module.exports = router;
