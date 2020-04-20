const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Employee, Company } = require('../').schema;

// tạo bảng datatable khen thưởng
const CommendationSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // mã số quyết định khen thưởng
        type: String,
        require: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: String,
        require: true,
    },
    startDate: { // ngày ra quyết định
        type: String
    },
    type: { // hình thức khen thưởng: tiền, bằng khen, ...
        type: String
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

module.exports = Commendation = mongoose.model("commendations", CommendationSchema);