const { Schema, model } = require('mongoose');

const PrivilegeApiSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        required: false,
        type: String
    },
    apis: [{
        path: {
            type: String,
        },
        method: {
            type: String
        },
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3]  // 0: invalid, 1: chờ phê duyệt, 2: từ chối, 3: đồng ý
    },
    token: {
        type: String,
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = model('PrivilegeApiSchema', PrivilegeApiSchema);

