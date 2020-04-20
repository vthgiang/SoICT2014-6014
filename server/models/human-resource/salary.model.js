const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// tạo bảng datatbale lương nhân viên
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
    mainSalary: {
        type: String,
        require: true,
    },
    bonus: [{
        nameBonus: String,
        number: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Salary = mongoose.model("salaries", SalarySchema);