const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// toạ bảng datatable nghỉ lễ tết
const holidaySchema = new Schema({
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
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = Holiday = mongoose.model("holidays", holidaySchema);