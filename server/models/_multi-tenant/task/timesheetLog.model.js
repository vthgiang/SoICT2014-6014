const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý dữ liệu lịch sử bấm giờ thực hiện công việc
const TimesheetLogSchema = new Schema({
    task: { //lưu id của công việc 
        type: Schema.Types.ObjectId,
        ref: 'tasks',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    // Thời gian bắt đầu bấm giờ 
    start: {
        type: Number,
        required: true
    },
    // Thời gian bắt đầu tính giờ hiện tại
    startTimer: {
        type: Number,
        required: true
    },
    stopTimer: {
        type: Number
    },
    time: {
        type: Number,
        default: 0
    },
    pause: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = TimesheetLog = (db) => db.model("timesheet_logs", TimesheetLogSchema);