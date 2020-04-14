const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Bảng đề nghị mua sắm thiết bị
const RecommendProcureSchema = new Schema({
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
    equipment: { //Tên thiết bị đề nghị mua sắm
        type: String,
    },
    supplier: { //nhà cung cấp
        type: String,
    },
    total: { //số lượng
        type: String,
    },
    unit: { //đơn vị tính
        type: String,
    },
    estimatePrice: { //Giá trị dự tính
        type: String
    },
    note: { //ghi chú
        type: String
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

module.exports = RecommendProcure = mongoose.model("recommend_procure", RecommendProcureSchema);