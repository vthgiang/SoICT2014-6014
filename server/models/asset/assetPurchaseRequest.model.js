const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const User = require('../auth/user.model');

// Bảng đề nghị mua sắm thiết bị
const AssetPurchaseRequestSchema = new Schema({
    company: { //công ty
        type: Schema.Types.ObjectId,
        ref: Company
    },
    recommendNumber: { //mã phiếu
        type: String,
        // required: true
    },
    dateCreate: { //ngày lập
        type: Date,
    },
    proponent: { //người đề nghị
        type: Schema.Types.ObjectId,
        ref: User
    },
    equipmentName: { //Tên thiết bị đề nghị mua sắm
        type: String,
        required: true
    },
    equipmentDescription: { // Mô tả thiết bị đề nghị mua sắm
        type: String,
    },
    supplier: { //nhà cung cấp
        type: String,
    },
    total: { //số lượng
        type: String,
        required: true
    },
    unit: { //đơn vị tính
        type: String,
        required: true
    },
    estimatePrice: { //Giá trị dự tính
        type: String
    },
    note: { //ghi chú
        type: String
    },
    approver: { //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: User
    },
    status: {//trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = AssetPurchaseRequest = mongoose.model("asset_purchase_requests", AssetPurchaseRequestSchema);