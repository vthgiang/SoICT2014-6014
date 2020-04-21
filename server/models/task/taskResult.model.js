const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');

// Model quản lý kết quả thực hiệc công việc
const TaskResultSchema = new Schema({
    // Người được đánh giá
    employee:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    // vai trò: người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
    role:{
        type: String,
        required: true
    },
    // Điểm hệ thống đánh giá
    automaticPoint: {
        type: Number,
        default: 0
    },
    // Điểm tự đánh giá
    employeePoint: {
        type: Number,
        default: 0
    },
    // Điểm do quản lý đánh giá
    approvedPoint: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = TaskResult = mongoose.model("task_results", TaskResultSchema);