const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DetailKPIUnit = require('./detailKPIUnit.model');

// Create Schema
const DetailKPIPersonalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: DetailKPIUnit,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    // null: Chưa phê duyệt, 0: Yêu cầu làm lại,1: Đã kích hoạt, 2: Đã kết thúc
    status: {
        type: Number,
        default: null
    },
    // Đánh đấu các mục tiêu mặc định khi thiết lập kpi cá nhân: 
    // 0 là không phải mục tiêu mặc định
    // 1 là mục tiêu mặc đinh cho vai trò A (người phê duyệt)
    // 2 là mục tiêu mặc định cho vai trò C (Người hỗ trợ)
    default: {
        type: Number,
        default: 0
    },
    systempoint: {
        type: Number,
        default: null
    },
    mypoint: {
        type: Number,
        default: null
    },
    approverpoint: {
        type: Number,
        default: null
    }
});

module.exports = DetailKPIPersonal = mongoose.model("detail_kpipersonals", DetailKPIPersonalSchema);