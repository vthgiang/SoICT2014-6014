const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const Asset = require('./asset.model');
const User = require('../auth/user.model');

// toạ bảng datatable cấp phát - điều chuyển - thu hồi
const DistributeTransferSchema = new Schema({
    asset: {
        type: Schema.Types.ObjectId,
        ref: Asset,
        // require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
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
    handoverMan : {//người ban giao là người đang quản lý tài sản, lấy id từ model asset: manager
        type: Schema.Types.ObjectId,
        ref: User
    },
    receiver : {//người tiếp nhận: chọn từ danh sách user
        type: Schema.Types.ObjectId,
        ref: User
    },

    nowLocation :{//vị trí ban đầu của tài sản là vị trí hiện tại lúc chưa cấp phát - điều chuyển - thu hồi
        type: String, // vị trí hiện tại của tài sản, lấy từ model asset
    },
    
    nextLocation :{//vị trí tiếp theo của tài sản
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