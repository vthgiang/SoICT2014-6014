const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý tài liệu của một công việc
const TaskFileSchema = new Schema({
    name: {
        type: String,
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = TaskFile = (db) => db.model("task_files", TaskFileSchema);