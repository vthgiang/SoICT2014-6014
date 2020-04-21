const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');
const EmployeeKpi = require('../kpi/employeeKpi.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model');
const TaskTemplate = require('./taskTemplate.model');
const TaskFile = require('./taskFile.model');
const TaskResultInformation = require('./taskResultInformation.model');

// Model quản lý thông tin của một công việc và liên kết với tài liệu, kết quả thực hiện công việc
const TaskSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {// có 6 trạng thái công việc: Đang chờ, Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Bị hủy, Tạm hoãn
        // TODO {code{}, description{} }
        type: String,
        default: "Đang chờ",//
        required: true
    },
    taskTemplate: {
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
    kpis:[{
        type: Schema.Types.ObjectId,
        ref: EmployeeKpi,
        required: true
    }],
    responsibleEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required:  true
    }],
    accountableEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    consultedEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    informedEmployees: [{
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
    // results: [{
    //     type: Schema.Types.ObjectId,
    //     ref: ResultTask,
    // }],
    results: [{
        // Người được đánh giá
        employee:{
            type: Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
        role:{
            type: String,
            required: true
        },
        // Điểm hệ thống đánh giá
        automaticPoint: {
            type: Number,
            default: 0
        },
        // Điểm tự đánh giá
        employeePoint: {
            type: Number,
            default: 0
        },
        // Điểm do quản lý đánh giá
        approvedPoint: {
            type: Number,
            default: 0
        }
    }],
    files: [{
        type: Schema.Types.ObjectId,
        ref: TaskFile,
        required: true
    }],
    resultInformations: [{
        type: Schema.Types.ObjectId,
        ref: TaskResultInformation,
    }],
    taskActions: [{
        creator:{
            type:Schema.Types.ObjectId,
            ref : User,
            required:true
        },
        name:{
            type: String,
            required:true
        },
        date:{
            type: Date
        },
        actionComments: [{
            creator: {
                type: Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            parent: {// Có thể là comment cha hoặc là action task
                type: Schema.Types.ObjectId,
                 replies: this
            },
            content: {
                type: String,
            },
            approved: {
                type: Number,
                default: 0,
                required: true
            },
            // file: {
            //     type: Schema.Types.ObjectId,
            //     ref: TaskFile,
            //     required: true
        // }
        }]
    }],
    // commentTask: [{
    //     type: Schema.Types.ObjectId,
    //     ref: CommentTask
    // }]
}, {
    timestamps: true
});

module.exports = Task = mongoose.model("tasks", TaskSchema);