const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// Tạo bảng datatable nghỉ phép
const AnnualLeaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company,
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
        enum:['pass', 'process', 'faile'],  // pass-đã chấp nhận, process-chờ phê duyệt, faile-Không cấp nhận  , 
    }
}, {
    timestamps: true,
});

module.exports = AnnualLeave = mongoose.model("annual_leaves", AnnualLeaveSchema);