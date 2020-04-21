const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskTemplate = require('./taskTemplate.model');

// Model lưu dữ liệu của các thông tin công việc theo mẫu công việc
const TaskTemplateInformationSchema = new Schema({
    taskTemplate:{
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
        required: true
    },
    code: { // Mã dùng trong công thức
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
    extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
        type: String
    },
    mandatory: { // Chỉ quản lý được điền?
        type: Boolean,
        default: true,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = TaskTemplateInformation = mongoose.model("task_template_informations", TaskTemplateInformationSchema);