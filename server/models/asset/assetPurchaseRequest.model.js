const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Bảng đề nghị mua sắm thiết bị
const AssetPurchaseRequestSchema = new Schema({
    company: {
        //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    recommendNumber: {
        //mã phiếu
        type: String,
    },
    dateCreate: {
        //ngày lập
        type: Date,
        default: Date.now,
    },
    proponent: {
        //người đề nghị
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    recommendUnits: [{ // Đơn vị đề nghị
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    }],
    files: [{ // Tài liệu đính kèm phiếu đăng kí mua sắm
        fileName: {
            type: String,
        },
        url: {
            type: String
        }
    }],
    equipmentName: {
        //Tên thiết bị đề nghị mua sắm
        type: String,
        required: true,
    },
    equipmentDescription: {
        // Mô tả thiết bị đề nghị mua sắm
        type: String,
    },
    supplier: {
        //nhà cung cấp
        type: String,
    },
    total: {
        //số lượng
        type: String,
    },
    unit: {
        //đơn vị tính
        type: String,
    },
    estimatePrice: {
        //Giá trị dự tính
        type: String,
    },
    note: {
        //ghi chú
        type: String,
    },
    approver: [{
        //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    status: {
        //trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db) => {
    if (!db.models.AssetPurchaseRequest)
        return db.model("AssetPurchaseRequest", AssetPurchaseRequestSchema);
    return db.models.AssetPurchaseRequest;
};
