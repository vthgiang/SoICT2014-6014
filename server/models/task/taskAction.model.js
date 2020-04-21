const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các hoạt động của một công việc theo mẫu
const TaskTemplateActionSchema = new Schema({
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mandatory: { // Hoạt động này bắt buộc hay không?
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = TaskTemplateAction = mongoose.model("task_actions", TaskTemplateActionSchema);