const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user.model');

// Model quản lý kết quả thực hiệc công việc
const ResultTaskSchema = new Schema({
    // Người được đánh giá
    member:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    // Điểm hệ thống đánh giámem
    systempoint: {
        type: Number,
        default: 0
    },
    // Điểm tự đánh giá
    mypoint: {
        type: Number,
        default: 0
    },
    // Điểm do quản lý đánh giá
    approverpoint: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = ResultTask = mongoose.model("result_tasks", ResultTaskSchema);