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
    manager : {//người quản lý tài sản là người đang quản lý tài sản, lấy id từ model asset: manager
        type: Schema.Types.ObjectId,
        ref: User
    },
    handoverMan : {//người ban giao là người đang quản lý tài sản, lấy id từ model asset: person
        type: Schema.Types.ObjectId,
        ref: User
    },
    receiver : {//người tiếp nhận: chọn từ danh sách user
        type: Schema.Types.ObjectId,
        ref: User
    },

    /**
     * Vị trí ban đầu của tài sản
     * Giải thích: lấy dữ liệu từ field position trong db asset
     * và lưu vào field nowLocation trong db distributeTransfer
     */
    nowLocation :{
        type: String,
    },

    /**
     * Vị trí tiếp theo của tài sản
     * Giải thích: khi cập nhật vị trí tiếp theo của tài sản, 
     * vừa cập nhật dữ liệu vào field nextLocation trong db distributeTransfer
     * vừa cập nhật dữ liệu vào field location trong db asset
     */
    nextLocation :{
        type: String,
        required: true
    },

    /**
     * Thời gian sử dụng từ ngày
     * Khi cập nhật dữ liệu, vừa cập nhật dữ liệu vào field dateStartUse trong db asset
     * vừa cập nhật dữ liệu vào field dateStartUse trong db distributeTransfer
     */
    dateStartUse: {
        type: String,
        required: true
    },

    /**
     * Thời gian sử dụng đến ngày
     * Khi cập nhật dữ liệu, vừa cập nhật dữ liệu vào field dateEndUse trong db asset
     * vừa cập nhật dữ liệu vào field dateEndUse trong db distributeTransfer
     */
    dateEndUse: {
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