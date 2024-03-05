const { Schema, model } = require('mongoose');

const UserRoleSchema = new Schema({ // Liên kết nhiều nhiều giữa User và Role
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    policies: [{
        type: Schema.Types.ObjectId,
        ref: 'Policy'
    }],
    delegation: {
        type: Schema.Types.ObjectId,
        ref: 'Delegation'
    }
});

module.exports = model('UserRoleSchema', UserRoleSchema);

