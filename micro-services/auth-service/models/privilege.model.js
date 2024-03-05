const { Schema, model } = require('mongoose');

const PrivilegeSchema = new Schema({
    resourceId: {
        type: Schema.Types.ObjectId,
        refPath: 'resourceType',
        required: true
    },
    resourceType: {
        type: String,
        enum: ['Link', 'TaskTemplate', 'Component', 'ProcessTemplate'], // tên model tương ứng - không đổi về dạng chữ thường
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    policies: [{
        type: Schema.Types.ObjectId,
        ref: 'Policy',
    }],
    delegations: [{
        type: Schema.Types.ObjectId,
        ref: 'Delegation'
    }],
    actions: [{
        type: String,
        enum: ['see', 'open', 'edit', 'delete'],
    }]
});

module.exports = model('PrivilegeSchema', PrivilegeSchema);

