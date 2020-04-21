const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User= require('../auth/user.model');
const Notification= require('./notification.model');

// Create Schema
const NotificationUserSchema = new Schema({ // Bảng liên kết nhiều nhiều giữa Notification và User
    userId: {//gửi đến cho người nào
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    notificationId: { //thông báo
        type: Schema.Types.ObjectId,
        ref: 'notifications',
        required: true
    },
    readed: { //đã đọc hay chưa?
        type: Boolean,
        default: 'false'
    }
});

module.exports = NotificationUser = mongoose.model("notification_users", NotificationUserSchema);