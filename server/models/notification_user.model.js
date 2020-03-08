const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NotificationUserSchema = new Schema({
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
    readed:{ //đã đọc hay chưa?
        type: Boolean,
        default: 'false'
    }
});

module.exports = NotificationUser = mongoose.model("notification_user", NotificationUserSchema);