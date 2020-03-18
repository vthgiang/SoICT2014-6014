const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskTemplate = require('./taskTemplate.model');

// Model lưu dữ liệu của các thông tin công việc theo mẫu công việc
const InformationTaskTemplateSchema = new Schema({
    tasktemplate:{
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
        required: true
    },
    code: {
        type: String,
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
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = InformationTaskTemplate = mongoose.model("information_task_templates", InformationTaskTemplateSchema);