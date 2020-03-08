const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const NotificationSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    icon: { //gồm 4 loại: info, normal, warning, error
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creater: {
        type: Schema.Types.ObjectId,
        refs: 'users'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

NotificationSchema.virtual('users', { //thông báo cho những người nào
    ref: 'notification_user',
    localField: '_id',
    foreignField: 'notificationId'
});

NotificationSchema.plugin(mongoosePaginate);

module.exports = Notification = mongoose.model("notifications", NotificationSchema);