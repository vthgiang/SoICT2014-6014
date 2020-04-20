const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các mục tiêu chi tiết của kpi đơn vị
const OrganizationalUnitKpiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },
    weight: {
        type: Number,
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        default: 0
    },
    // Đánh đấu các mục tiêu mặc định khi thiết lập kpi cá nhân: 
    // 0 là không phải mục tiêu mặc định
    // 1 là mục tiêu mặc đinh cho vai trò A (người phê duyệt)
    // 2 là mục tiêu mặc định cho vai trò C (Người hỗ trợ)
    default: {
        type: Number,
        default: 0
    }
});

module.exports = OrganizationalUnitKpi = mongoose.model("organizational_unit_kpis", OrganizationalUnitKpiSchema);

// Thuộc tính không đổi