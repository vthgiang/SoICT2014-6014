const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// toạ bảng datatable sửa chữa - thay thế - nâng cấp
const RepairUpgradeSchema = new Schema({
    asset: {
        type: Schema.Types.ObjectId,
        ref: 'assets',
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    repairNumber: {//số phiếu
        type: String,
        required: true
    },
    type: {//phân loại: 1. sửa chữa , 2.thay thế , 3. nâng cấp
        type: String,
        required: true,
    },
    dateCreate: { //ngày lập
        type: String,
        required: true
    },
    reason: {// nội dung, lý do
        type: String,
        required: String

    },
    repairDate: {//Ngày bắt đầu sửa
        type: String
    },
    completeDate: {//Ngày hoàn thành
        type: String
    },
    cost: { //chi phí sửa chữa - thay thế  - NÂNG CẤP
        type: String,
        required: true
    },
    status: {//trạng thái, tình trạng: chưa thực hiện || đang thực hiện || đã thực hiện
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
    
})

module.exports = RepairUpgrade = mongoose.model("repair_upgrade", RepairUpgradeSchema);