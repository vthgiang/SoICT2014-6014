const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable chấm công
const TimesheetsSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true,
    },
    month: {
        type: Date,
        required: true,
    },
    workSession1: [{ // Ca làm việc 1 (ví dụ buổi sáng), true là làm việc, false là nghỉ việc
        type: Boolean,
    }],
    workSession2: [{ // Ca làm việc 2 (ví dụ buổi chiều), true là làm việc, false là nghỉ việc
        type: Boolean,
    }],
}, {
    timestamps: true,
});

module.exports = Timesheets = (db) => db.model("timesheets", TimesheetsSchema);