const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    }
});

module.exports = UserRole = mongoose.model('user_roles', UserRoleSchema);