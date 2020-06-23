const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');
const Employee = require('./employee.model');

// Tạo bảng datatable chấm công
const TimesheetsSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    workSession1: [{
        day: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
            enum: ["true", "false", "null"],
        }
    }],
    workSession2: {
        day: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
            enum: ["true", "false", "null"],
        }
    },
}, {
    timestamps: true,
});

module.exports = Timesheets = mongoose.model("timesheets", TimesheetsSchema);