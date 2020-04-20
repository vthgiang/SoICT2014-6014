const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User, Notification } = require('../').schema;


// Create Schema
const NotificationUserSchema = new Schema({ // Bảng liên kết nhiều nhiều giữa Notification và User
    userId: {//gửi đến cho người nào
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    notificationId: { //thông báo
        type: Schema.Types.ObjectId,
        ref: Notification,
        required: true
    },
    readed: { //đã đọc hay chưa?
        type: Boolean,
        default: 'false'
    }
});

module.exports = NotificationUser = mongoose.model("notification_users", NotificationUserSchema);