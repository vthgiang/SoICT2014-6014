const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../auth/user.model')
const OrganizationalUnit = require('../../models/super-admin/organizationalUnit.model');
const TaskTemplate = require('../../models/task/taskTemplate.model');

const TaskReportSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        required: true
    },
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
    },
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
    },
    responsibleEmployees: [{ //Người thực hiện
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    accountableEmployees: [{// Người phê duyệt
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    status: {// 0: tất cả, 1: Finished, 2: Inprocess.
        type: String,
    },
    frequency: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    configurations: [{
        code: { // Mã thuộc tính công việc dùng trong công thức
            type: String,
            required: true
        },
        name: { // Tên thuộc tính công việc
            type: String,
            required: true
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        type: {
            type: String,
            required: true,
            enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
        },
        filter: {
            type: String,
        },
        showInReport: {
            type: Boolean
        },
        newName: {
            type: String
        },
        aggregationType: { // 0: tính theo kiểu trung bình cộng, 1: tính theo kiểu tổng
            type: Number
        },
        charType: { // 0: colChart, 1: barchart,....
            type: Number
        }
    }]
}, {
    timestamps: true
});

module.exports = TaskReport = mongoose.model("task-report", TaskReportSchema);