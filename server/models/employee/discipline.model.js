const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Employee, Company } = require('../').schema;

// toạ bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    decisionNumber: { // số hiệu quyết định kỷ luật
        type: String,
        require: true,
    },
    organizationalUnit: { // cấp ra quyết định
        type: String,
        require: true,
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    type: { // hình thức kỷ luật
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

module.exports = Discipline = mongoose.model("disciplines", DisciplineSchema);