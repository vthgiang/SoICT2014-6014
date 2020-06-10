const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationalUnitKpi = require('./organizationalUnitKpi.model');

// Create Schema
const EmployeeKpiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnitKpi,
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
    type: {
        type: Number,
        default: 0
    },
    automaticPoint: { // Điểm tự động
        type: Number,
        default: null
    },
    employeePoint: { // Điểm nhân viên tự đánh giá
        type: Number,
        default: null
    },
    approvedPoint: {
        type: Number,
        default: null
    }
}, {
<<<<<<< HEAD
    timestamps :true
=======
    timestamps: true
>>>>>>> afc553aec90ce8e3cd207486f2e0d8a226f6c268
});

module.exports = EmployeeKpi = mongoose.model("employee_kpis", EmployeeKpiSchema);