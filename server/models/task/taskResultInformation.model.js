const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');
const TaskTemplateInformation = require('./taskTemplateInformation.model');


// Model quản lý kết quả của các thông tin công việc theo mẫu
const TaskResultInformationSchema = new Schema({
    member:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    taskInformation: {
        type: Schema.Types.ObjectId,
        ref: TaskTemplateInformation,
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
    }
}, {
    timestamps: true
});

module.exports = TaskResultInformation = mongoose.model("task_result_informations", TaskResultInformationSchema);