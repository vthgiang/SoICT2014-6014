const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model')

// Tạo bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // số hiệu quyết định kỷ luật
        type: String,
        required: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    type: { // hình thức kỷ luật
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

module.exports = Discipline = mongoose.model("disciplines", DisciplineSchema);