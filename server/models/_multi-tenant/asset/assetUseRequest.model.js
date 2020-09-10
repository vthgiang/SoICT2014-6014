const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// tạo bảng csdl Đề nghị cấp phát thiết bị
const AssetUseRequestSchema = new Schema({
    company: { //công ty
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    recommendNumber: { //mã phiếu
        type: String,
        required: true
    },
    dateCreate: { //ngày lập
        type: String,
        defaut: Date.now
    },
    proponent: { //người đề nghị
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    reqContent: { //nội dung đề nghị cấp phát
        type: String,
    },
    asset: { //asset
        type: Schema.Types.ObjectId,
        ref: 'assets'
    },
    dateStartUse: { //thời gian đăng ký sử dụng từ ngày
        type: String,
        defaut: Date.now,
    },
    dateEndUse: { //thời gian đăng ký sử dụng đến ngày
        type: String,
        defaut: Date.now,
    },
    approver: { //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: 'users'
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

module.exports = AssetUseRequest = (db) => db.model("asset_use_requests", AssetUseRequestSchema);