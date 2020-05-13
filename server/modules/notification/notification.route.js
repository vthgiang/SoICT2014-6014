const express = require("express");
const router = express.Router();
const NotificationController = require('./notification.controller');
const { auth } = require('../../middleware');

// Lấy tất cả các thông báo mà admin, giám đốc... đã tạo
router.get("/get", auth, NotificationController.getAllManualNotifications);

// Lấy phân trang các thông báo mà admin, giám đốc... đã tạo
router.post("/paginate", auth, NotificationController.paginateManualNotifications);

// Tạo thông báo mới và gửi đến đâu đó - tạo manual notification và notification
router.post("/create", auth, NotificationController.createNotification);

// Xóa thông báo đã tạo - xóa manual notification
router.delete("/delete-manual-notification/:id", auth, NotificationController.deleteManualNotification);

// Lấy tất cả các thông báo nhận được - user xem tất cả các thông từ ai đó, nguồn nào đó gửi đến cho mình
router.get("/get-notifications", auth, NotificationController.getAllNotifications);
router.post("/paginate-notifications", auth, NotificationController.paginateNotifications);

// Người dùng xóa thông báo đã nhận của mình - xóa notitication
router.delete("/delete-notification/:id", auth, NotificationController.deleteNotification);

// Đánh dấu thông báo đã được đọc
router.patch("/readed/:id", auth, NotificationController.changeNotificationStateToReaded);

module.exports = router;
