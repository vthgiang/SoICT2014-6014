const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// tạo bảng datatable nghỉ phép
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
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }, // TODO: dùng timestamp tương tự Thái ở collection User
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = AnnualLeave = mongoose.model("annual_leaves", AnnualLeaveSchema);