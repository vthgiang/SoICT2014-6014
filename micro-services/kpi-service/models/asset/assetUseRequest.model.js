const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Updated
// tạo bảng csdl Đề nghị cấp phát tài sản
const AssetUseRequestSchema = new Schema({
    company: {
        //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    recommendNumber: {
        //mã phiếu
        type: String,
    },
    dateCreate: {
        //ngày lập
        type: Date,
        defaut: Date.now,
    },
    proponent: {
        //người đề nghị
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reqContent: {
        //nội dung đề nghị cấp phát
        type: String,
    },
    asset: {
        //asset
        type: Schema.Types.ObjectId,
        ref: "Asset",
    },
    dateStartUse: {
        //thời gian đăng ký sử dụng từ ngày
        type: Date,
    },
    dateEndUse: {
        //thời gian đăng ký sử dụng đến ngày
        type: Date,
    },
    approver: {
        //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    note: {
        //ghi chú
        type: String,
    },
    status: {
        //trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
        type: String,
        enum: ["approved", "waiting_for_approval", "disapproved"],
    },
    task: {
        //yêu cầu sử dụng tài sản cho công việc gì
        type: Schema.Types.ObjectId,
        ref: "Task",
    }
});

module.exports = (db) => {
    if (!db.models.AssetUseRequest)
        return db.model("AssetUseRequest", AssetUseRequestSchema);
    return db.models.AssetUseRequest;
};
