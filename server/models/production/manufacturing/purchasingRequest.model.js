const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng phiếu đề nghị mua nguyên vật liệu
const PurchasingRequestSchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        required: true
    },
    purpose: { // Mục đích tạo
        type: String
    },
    approvers: [{ // Danh sách người phê duyệt
        approver: { // Người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        approveredTime: { // Thời gian phê duyệt
            type: Date
        }
    }],
    materials: [{ // Danh sách nguyên vật liệu
        good: { // Nguyên vật liệu
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: { // Số lượng
            type: Number
        }
    }],
    intendReceiveTime: { // Thời gian dự kiến nhận
        type: Date
    },
    status: { // Trạng thái phiếu đề nghị mua nguyên vật liệu: 0. Chưa được duyệt xong || 1. Đã được duyệt xong
        type: Number,
        default: 0
    },
    description: { // Mô tả phiếu đề nghị mua nguyên vật liệu
        type: String
    }
}, {
    // Thời gian tạo, sửa phiếu đề nghị mua nguyên vật liệu
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.PurchasingRequest)
        return db.model("PurchasingRequest", PurchasingRequestSchema)
    return db.models.PurchasingRequest;
}