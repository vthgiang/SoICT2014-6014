const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({ // Liên kết nhiều nhiều giữa User và Role
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    },
});

module.exports = UserRole = (db) => db.model('user_roles', UserRoleSchema);