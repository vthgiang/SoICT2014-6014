const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable nghỉ lễ tết
const HolidaySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    maximumNumberOfLeaveDays: {
        type: Number,
        default: 0,
        required: true,
    },
    holidays: [{
        type: {
            type: String,
            required: true,
            enum: ['holiday', 'auto_leave', 'no_leave'],
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    }],
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Holiday)
        return db.model('Holiday', HolidaySchema);
    return db.models.Holiday;
}