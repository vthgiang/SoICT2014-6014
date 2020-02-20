const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');

// Create Schema
const TaskHistory = new Schema({
    time: {
        type: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: Role
    },
    task: {
        type: Schema.Types.ObjectId
    },
    log: {
        type: String
        //VD: Đã sửa tên công việc thành "Kiểm thử sản phẩm thuốc", sửa tiến dộ công việc thành "70%"
        // có 1 button show log - bấm vào thì sẽ mở 1 trang mới chứa thông tin về lịch sử
    }
});

module.exports = User = mongoose.model("task_histories", TaskHistory);