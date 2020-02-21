const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employee = require("./employee.model");

// toạ bảng datatable kỷ luật
const SabbaticalSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: Employee,
        require: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    reason: {
        type: String
    },
    status: {
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

module.exports = Sabbatical = mongoose.model("sabbatical", SabbaticalSchema);