const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const Asset = require('./asset.model');
const User = require('../auth/user.model');

// tạo bảng csdl Đề nghị cấp phát thiết bị
const AssetUseRequestSchema = new Schema({
    company: { //công ty
        type: Schema.Types.ObjectId,
        ref: Company
    },
    recommendNumber: { //mã phiếu
        type: String,
        required: true
    },
    dateCreate: { //ngày lập
        type: Date,
        // default: Date.now
    },
    proponent: { //người đề nghị
        type: Schema.Types.ObjectId,
        ref: User
    },
    reqContent: { //nội dung đề nghị cấp phát
        type: String,
    },
    asset: { //asset
        type: Schema.Types.ObjectId,
        ref: Asset
    },
    dateStartUse: { //thời gian đăng ký sử dụng từ ngày
        type: Date,
        default: Date.now,
    },
    dateEndUse: { //thời gian đăng ký sử dụng đến ngày
        type: Date,
        default: Date.now,
    },
    approver: { //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: User
    },
    note: { //ghi chú
        type: String
    },
    status: { //trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
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

module.exports = AssetUseRequest = mongoose.model("asset_use_requests", AssetUseRequestSchema);