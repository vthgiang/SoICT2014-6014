const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatbale lương nhân viên
const SalarySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'organizational_units',
        required: true,
    },
    month: {
        type: Date,
        required: true,
    },
    mainSalary: { // Lương chính
        type: String,
        required: true,
    },
    unit: { // Đơn vị tiền lương(VND hoặc USD)
        type: String,
        required: true,
        enum: ['VND', 'USD'],
        default: 'VND',
    },
    bonus: [{ // Tiền lương thưởng khác
        nameBonus: String,
        number: String,
    }],
}, {
    timestamps: true,
});

module.exports = Salary = (db) => db.model("salaries", SalarySchema);