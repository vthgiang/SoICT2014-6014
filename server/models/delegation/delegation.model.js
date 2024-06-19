const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DelegationSchema = new Schema({
    name: {
        // 1. Tên ủy quyền
        type: String,
        required: true
    },
    description: {
        // 2. Mô tả
        type: String
    },
    delegator: {
        // 3. Id của Requester ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'Requester'
    },
    delegatee: {
        // 4. Id Requester nhận ủy quyền
        type: Schema.Types.ObjectId,
        ref: 'Requester'
    },
    delegateObject: {
        // 5. Id của object được ủy quyền
        type: Schema.Types.ObjectId,
        refPath: 'delegateObjectType'
    },
    delegateObjectType: {
        // 6. Loại ủy quyền
        type: String,
        enum: ['Role', 'Task', 'Resource'], // tên model tương ứng - không đổi về dạng chữ thường
    },
    startDate: {
        // 7. Ngày bắt đầu ủy quyền
        type: Date,
    },
    endDate: {
        // 8. Ngày thu hồi ủy quyền tự động
        type: Date,
    },
    revokedDate: {
        // 9. Ngày thu hồi ủy quyền thủ công
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
    policy: {
        type: Schema.Types.ObjectId,
        ref: 'DelegationPolicy'
    },
    metaData: {
        // metadata cho delegate Task
        delegateTaskRoles: [{
            // Vai trò công việc ủy quyền RACI 
            type: String,
            enum: ['responsible', 'accountable', 'consulted', 'informed']
        }],
        delegatorHasInformed: {
            type: Boolean,
        },

        // metadata cho delegate Role
        allPrivileges: {
            // 8. Ủy quyền tất cả privilege của role
            type: Boolean,
        },
        delegatePrivileges: [{
            // 9. Array các Privileges ủy quyền
            type: Schema.Types.ObjectId,
            ref: 'Privilege'
        }],
    },
    logs: [
        {
            // Thời gian tạo log
            createdAt: {
                type: Date,
                default: Date.now,
            },
            // Requester
            requester: {
                type: Schema.Types.ObjectId,
                ref: "Requester",
            },
            // Nội dung
            content: {
                type: String,
            },
            // Thời gian
            time: {
                type: Date
            },
            // Loại log
            category: {
                type: String,
                default: "page_access",
                enum: [
                    "login",
                    "logout",
                    "page_access",
                    "create",
                    "edit",
                    "revoke",
                    "confirm",
                    "reject",
                    "activate",
                    "switch_delegate_role"
                ],
            }
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
