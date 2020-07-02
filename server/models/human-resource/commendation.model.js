const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model')

// Tạo bảng datatable khen thưởng
const CommendationSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // mã số quyết định khen thưởng
        type: String,
        required: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit
    },
    startDate: { // ngày ra quyết định
        type: Date,
        required: true,
    },
    type: { // hình thức khen thưởng: tiền, bằng khen, ...
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = Commendation = mongoose.model("commendations", CommendationSchema);