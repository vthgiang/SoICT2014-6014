const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// New
// Bảng đề nghị mua sắm vật tư
const SuppliesPurchaseRequestSchema = new Schema({
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
    suppliesName: {
        //Tên vật tư đề nghị mua sắm
        type: String,
        required: true,
    },
    suppliesDescription: {
        // Mô tả vật tư đề nghị mua sắm
        type: String,
    },
    supplier: {
        //nhà cung cấp
        type: String,
    },
    total: {
        //số lượng
        type: Number,
    },
    unit: {
        //đơn vị tính
        type: String,
    },
    estimatePrice: {
        //Giá trị dự tính
        type: Number,
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
    if (!db.models.SuppliesPurchaseRequest)
        return db.model("SuppliesPurchaseRequest", SuppliesPurchaseRequestSchema);
    return db.models.SuppliesPurchaseRequest;
};