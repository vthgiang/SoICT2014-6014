const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model');

// Tạo bảng datatable nghỉ phép
const AnnualLeaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company,
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
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
        enum: ['approved', 'waiting_for_approval', 'disapproved'], // approved-đã chấp nhận, waiting_for_approval-chờ phê duyệt, disapproved-Không cấp nhận  , 
    }
}, {
    timestamps: true,
});

module.exports = AnnualLeave = mongoose.model("annual_leaves", AnnualLeaveSchema);