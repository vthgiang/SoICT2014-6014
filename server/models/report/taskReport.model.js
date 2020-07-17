const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../auth/user.model')

const TaskReportSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
});

module.exports = TaskReport = mongoose.model("task-report", TaskReportSchema);