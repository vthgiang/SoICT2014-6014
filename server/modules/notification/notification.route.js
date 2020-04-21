const express = require("express");
const router = express.Router();
const NotificationController = require('./notification.controller');
const { auth } = require('../../middleware');

//Lấy tất cả các thông báo
router.get("/", auth, NotificationController.getAllNotifications);

//Lấy tất cả các thông báo mà user nhận
router.get("/receivered/:userId", auth, NotificationController.getNotificationReceivered);

//Lấy tất cả các thông báo mà user đã gửi
router.get("/sent/:userId", auth, NotificationController.getNotificationSent);

//Lấy các thông báo theo số lượng yêu cầu
router.post("/paginate", auth, NotificationController.getPaginatedNotifications);

//Tạo một thông báo mới
router.post("/", auth, NotificationController.createNotification);

//Xem chi tiết thông báo
router.get("/:id", auth, NotificationController.getNotification);

//Sửa thông báo
router.patch("/:id", auth, NotificationController.editNotification);

//Xóa thông báo
router.delete("/:id", auth, NotificationController.deleteNotification);

//Xóa thông báo đã nhận
router.delete("/receivered/:userId/:notificationId", auth, NotificationController.deleteNotificationReceivered);

//Xóa thông báo đã gửi
router.delete("/sent/:id", auth, NotificationController.deleteNotificationSent);

module.exports = router;
