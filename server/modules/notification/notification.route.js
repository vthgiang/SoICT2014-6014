const express = require("express");
const router = express.Router();
const NotificationController = require('./notification.controller');
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get("/get", auth, NotificationController.getAllManualNotifications);
router.post("/paginate", auth, NotificationController.paginateManualNotifications);
router.post("/create", auth, uploadFile([{ name: 'notificationFiles', path: '/notifications' }], 'array'), NotificationController.createNotification);
router.delete("/delete-manual-notification/:id", auth, NotificationController.deleteManualNotification);
router.get("/get-notifications", auth, NotificationController.getAllNotifications);
router.post("/paginate-notifications", auth, NotificationController.paginateNotifications);
router.delete("/delete-notification/:id", auth, NotificationController.deleteNotification);
router.patch("/readed", auth, NotificationController.changeNotificationStateToReaded);

module.exports = router;
