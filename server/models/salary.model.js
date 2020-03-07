const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// tạo bảng datatbale lương nhân viên
const SalarySchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    month: {
        type: String,
    },
    mainSalary: {
        type: String
    },
    bonus: [{
        nameBonus: String,
        number: String,
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = Salary = mongoose.model("salaries", SalarySchema);