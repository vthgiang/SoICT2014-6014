const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    delete_soft: {
        type: Boolean,
        required: true,
        default: false
    },
    token: [{
        type: String,
    }],
    reset_password_token: {
        type: String
    },
    avatar: {
        type: String
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

UserSchema.virtual('roles', {
    ref: 'user_role',
    localField: '_id',
    foreignField: 'userId'
});

UserSchema.virtual('notifications', {
    ref: 'notification_user',
    localField: '_id',
    foreignField: 'userId'
});

UserSchema.plugin(mongoosePaginate);

module.exports = User = mongoose.model("users", UserSchema);