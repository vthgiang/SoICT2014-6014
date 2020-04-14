const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// toạ bảng datatable cấp phát - điều chuyển - thu hồi
const DistributeTransferSchema = new Schema({
    asset: {
        type: Schema.Types.ObjectId,
        ref: 'assets',
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    distributeNumber: {//số phiếu
        type: String,
        require: true,
    },
    dateCreate: { //ngày lập
        type: String,
        required: true
    },
    type: {//phân loại: 1. cấp phát , 2.điều chuyển , 3. thu hồi
        type: String,
        require: true,
    },
    place : {// vị trí bàn giao
        type: String
    },
    firstPerson : {//người ban giao là người đang quản lý tài sản
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    secondPerson : {//người tiếp nhận
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    firstLocation :{//vị trí ban đầu của tài sản là vị trí hiện tại lúc chưa cấp phát - điều chuyển - thu hồi
        type: String,
    },
    
    secondLocation :{//vị trí tiếp theo của tài sản
        type: String,
        required: true
    },
    reason: {// nội dung, lý do
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

module.exports = DistributeTransfer = mongoose.model("distribute_transfer", DistributeTransferSchema);