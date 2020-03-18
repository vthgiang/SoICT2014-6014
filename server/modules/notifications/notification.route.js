const express = require("express");
const router = express.Router();
const NotificationController = require('./notification.controller');
const { auth } = require('../../middleware');

//Lấy tất cả các thông báo
router.get("/", auth, NotificationController.get);

//Lấy tất cả các thông báo mà user nhận
router.get("/receivered/:userId", auth, NotificationController.getNotificationReceivered);

//Lấy tất cả các thông báo mà user đã gửi
router.get("/sent/:userId", auth, NotificationController.getNotificationSent);

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
