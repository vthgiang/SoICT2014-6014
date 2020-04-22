const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// Tạo bảng datatbale lương nhân viên
const SalarySchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    month: {
        type: String,
        require: true,
    },
    mainSalary: { // Lương chính
        type: String,
        require: true,
    },
    unit: { // Đơn vị tiền lương(VND hoặc USD)
        type: String,
        required: true,
    },
    bonus: [{   // Tiền lương thưởng khác
        nameBonus: String,
        number: String,
    }],
}, {
    timestamps: true,
});

module.exports = Salary = mongoose.model("salaries", SalarySchema);