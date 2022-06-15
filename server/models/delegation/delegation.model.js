const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DelegationSchema = new Schema({
    delegationName: {
        // 1. Tên ủy quyền
        type: String,
        required: true
    },
    delegator: {
        // 2. Id user ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delegatee: {
        // 3. Id user nhận ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delegateType: {
        //  4. Loại ủy quyền
        type: String,
        enum: ['Role', 'Task'], // tên model tương ứng - không đổi về dạng chữ thường
    },
    delegateTasks: [{
        // 5. Array các task ủy ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    delegateRole: {
        // 6. Role ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    description: {
        // 7. Mô tả
        type: String
    },
    allPrivileges: {
        // 8. Ủy quyền tất cả privilege của role
        type: Boolean,
    },
    delegatePrivileges: [{
        // 9. Array các Privileges ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'Privilege'
    }],
    startDate: {
        // 10. Ngày bắt đầu ủy quyền
        type: Date,
    },
    endDate: {
        // 11. Ngày thu hồi ủy quyền tự động
        type: Date,
    },
    revokedDate: {
        // 12. Ngày thu hồi ủy quyền thủ công
        type: Date,
    },
    status: {
        // có 3 trạng thái của ủy quyền
        type: String,
        default: "pending",
        enum: [
            "activated", // Đang hoạt động
            "pending", // Chờ kích hoạt
            "revoked", // Thu hồi
        ],
    },
    replyStatus: {
        // Có 3 trạng thái phản hồi
        type: String,
        default: "wait_confirm",
        enum: [
            "declined", // Từ chối
            "confirmed", // Xác nhận
            "wait_confirm" // Chờ xác nhận
        ],
    },
    declineReason: {
        // Lý do từ chối
        type: String,
    },
    revokeReason: {
        type: String
    },
    logs: [
        {
            createdAt: {
                type: Date,
                default: Date.now,
            },
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
        },
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

DelegationSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Delegation)
        return db.model('Delegation', DelegationSchema);
    return db.models.Delegation;
}