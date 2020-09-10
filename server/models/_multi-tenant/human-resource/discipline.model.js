const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    decisionNumber: { // số hiệu quyết định kỷ luật
        type: String,
        required: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: Schema.Types.ObjectId,
        ref: 'organizational_units'
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
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

module.exports = Discipline = (db) => db.model("disciplines", DisciplineSchema);