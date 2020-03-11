const express = require("express");
const router = express.Router();
const NotificationController = require('./notification.controller');
const { auth } = require('../../middleware/auth.middleware');

//Lấy tất cả các thông báo
router.get("/", auth, NotificationController.get);

//Lấy các thông báo theo số lượng yêu cầu
router.post("/paginate", auth, NotificationController.getPaginate);

//Tạo một thông báo mới
router.post("/", auth, NotificationController.create);

//Xem chi tiết thông báo
router.get("/:id", auth, NotificationController.show);

//Sửa thông báo
router.patch("/:id", auth, NotificationController.edit);

//Xóa thông báo
router.delete("/:id", auth, NotificationController.delete);

module.exports = router;
