const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// toạ bảng datatable kỷ luật
const DisciplineSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    number: {
        type: String,
        require: true,
    },
    unit: {
        type: String,
        require: true,
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    type: {
        type: String
    },
    reason: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = Discipline = mongoose.model("disciplines", DisciplineSchema);