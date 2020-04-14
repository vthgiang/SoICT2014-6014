const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// tạo bảng csdl Đề nghị cấp phát thiết bị
const RecommendDistributeSchema = new Schema({
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
    approver: { //người phê duyệt
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {//trạng thái, tình trạng: chờ phê duyệt || không chấp nhận || đã chấp nhận
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = RecommendDistribute = mongoose.model("recommend_distribute", RecommendDistributeSchema);