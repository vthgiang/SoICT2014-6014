const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable khen thưởng
const CommendationSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    decisionNumber: { // mã số quyết định khen thưởng
        type: String,
        required: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: 'organizational_units'
    },
    startDate: { // ngày ra quyết định
        type: Date,
        required: true,
    },
    type: { // hình thức khen thưởng: tiền, bằng khen, ...
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

module.exports = Commendation = (db) => db.model("commendations", CommendationSchema);