const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable nghỉ phép
const AnnualLeaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies',
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'organizational_units',
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pass', 'process', 'faile'], // pass-đã chấp nhận, process-chờ phê duyệt, faile-Không cấp nhận  , 
    }
}, {
    timestamps: true,
});

module.exports = AnnualLeave = (db) => db.model("annual_leaves", AnnualLeaveSchema);