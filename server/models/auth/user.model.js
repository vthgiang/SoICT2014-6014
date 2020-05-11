const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const UserRole = require('./userRole.model');

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
    deleteSoft: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{
        type: String,
    }],
    resetPasswordToken: {
        type: String
    },
    avatar: {
        type: String,
        default: '/upload/avatars/user.png'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

UserSchema.virtual('roles', {
    ref: UserRole,
    localField: '_id',
    foreignField: 'userId'
});

UserSchema.plugin(mongoosePaginate);

module.exports = User = mongoose.model("users", UserSchema);