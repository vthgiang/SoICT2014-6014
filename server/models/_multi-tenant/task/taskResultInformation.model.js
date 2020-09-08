const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý kết quả của các thông tin công việc theo mẫu
const TaskResultInformationSchema = new Schema({
    member:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    taskInformation: {
        type: Schema.Types.ObjectId,
        ref: 'task_template_informations',
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
    }
}, {
    timestamps: true
});

module.exports = TaskResultInformation = (db) => db.model("task_result_informations", TaskResultInformationSchema);