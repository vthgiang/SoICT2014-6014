const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// Tạo bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // số hiệu quyết định kỷ luật
        type: String,
        require: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: String,
        require: true,
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    type: { // hình thức kỷ luật
        type: String
    },
    reason: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = Discipline = mongoose.model("disciplines", DisciplineSchema);