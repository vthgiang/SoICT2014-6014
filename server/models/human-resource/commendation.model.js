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
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // mã số quyết định khen thưởng
        type: String,
        require: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit
    },
    startDate: { // ngày ra quyết định
        type: Date,
        require: true,
    },
    type: { // hình thức khen thưởng: tiền, bằng khen, ...
        type: String,
        require: true,
    },
    reason: {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
});

module.exports = Commendation = mongoose.model("commendations", CommendationSchema);