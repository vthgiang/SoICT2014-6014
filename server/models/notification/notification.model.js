const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const User= require('../auth/user.model');
const NotificationUser= require('./notificationUser.model');

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
    level: { //gồm 4 loại: info, normal, warning, error
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        refs: User
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

NotificationSchema.virtual('users', { //thông báo cho những người nào
    ref: NotificationUser,
    localField: '_id',
    foreignField: 'notificationId'
});

NotificationSchema.plugin(mongoosePaginate);

module.exports = Notification = mongoose.model("notifications", NotificationSchema);