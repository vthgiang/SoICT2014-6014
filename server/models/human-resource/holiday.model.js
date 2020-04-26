const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = require('../system-admin/company.model');

// Tạo bảng datatable nghỉ lễ tết
const HolidaySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    reason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Holiday = mongoose.model("holidays", HolidaySchema);