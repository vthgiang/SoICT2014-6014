const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các hoạt động của một công việc theo mẫu
const ActionTaskTemplateSchema = new Schema({
    tasktemplate: {
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
    mandatary: { // Hoạt động này bắt buộc hay không?
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = ActionTaskTemplate = mongoose.model("action_task", ActionTaskTemplateSchema);