const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// toạ bảng datatable kỷ luật
const SabbaticalSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies',
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
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

module.exports = Sabbatical = mongoose.model("sabbaticals", SabbaticalSchema);