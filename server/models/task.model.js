const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user.model');
const KPIPersonal = require('./kpi-personal.model');
const Department = require('./department.model');
const TaskTemplate = require('./taskTemplate.model');
const ResultTask = require('./resultTask.model');
const TaskFile = require('./taskFile.model');
const ResultInfo = require('./resultInformationTask.model');

// Model quản lý thông tin của một công việc và liên kết với tài liệu, kết quả thực hiện công việc
const TaskSchema = new Schema({
    unit: {
        type: Schema.Types.ObjectId,
        ref: Department,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
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
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {// có 6 trạng thái công việc: Đang chờ, Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Bị hủy, Tạm hoãn
        type: String,
        default: "Đang chờ",
        required: true
    },
    tasktemplate: {
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: Role,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },
    level: {
        type: Number,
        required: true
    },
    kpi:[{
        type: Schema.Types.ObjectId,
        ref: KPIPersonal,
        required: true
    }],
    responsible: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required:  true
    }],
    accounatable: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    consulted: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    informed: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    time: {
        type: Number,
        default: 0,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        required: true
    },
    point: {
        type: Number,
        default: 0,
        required: true
    },
    results: [{
        type: Schema.Types.ObjectId,
        ref: ResultTask,
    }],
    file: [{
        type: Schema.Types.ObjectId,
        ref: TaskFile,
        required: true
    }],
    resultInfo: [{
        type: Schema.Types.ObjectId,
        ref: ResultInfo,
    }]
}, {
    timestamps: true
});

module.exports = Task = mongoose.model("tasks", TaskSchema);