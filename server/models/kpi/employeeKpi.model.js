const mongoose = require("mongoose");
const Schema = mongoose.Schema;;

// Create Schema
const EmployeeKpiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnitKpi',
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
    // 2 là mục tiêu mặc định cho vai trò C (Người tư vấn)
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
    },
    weeklyEvaluate: [{
        title: {    // week1 (1-7/month), week2 (8-14/month), week3 (15-21/month), week4 (21-28,29,30,31/month)
            type: String
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
        },
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.EmployeeKpi)
        return db.model('EmployeeKpi', EmployeeKpiSchema);
    return db.models.EmployeeKpi;
}