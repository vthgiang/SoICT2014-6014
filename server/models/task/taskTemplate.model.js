const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');
const Role = require('../auth/role.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model');

// Model quản lý dữ liệu của một mẫu công việc
const TaskTemplateSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        //require: true
    },
    name: {
        type: String,
        //require: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
        //require: true
    },
    priority: { // 1: Thấp, 2: Trung Bình, 3: Cao
        type: Number,
        //require: true
    },
    numberOfDaysTaken: {
        type: Number,
        default: 0,
    },
    taskActions: [{
        name: {
            type: String,
            //require: true
        },
        description: {
            type: String,
            //require: true
        },
        mandatory: { // Hoạt động này bắt buộc hay không?
            type: Boolean,
            default: true,
            //require: true
        },
        creator: {
            type : Schema.Types.ObjectId,
        }
    }],
    taskInformations: [{
        code: { // Mã thuộc tính công việc dùng trong công thức
            type: String,
            //require: true
        },
        name: { // Tên thuộc tính công việc
            type: String,
            //require: true
        },
        description: {
            type: String,
            //require: true
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        filledByAccountableEmployeesOnly: { // Chỉ người phê duyệt được điền?
            type: Boolean,
            default: true,
            //require: true
        },
        type: {
            type: String,
            //require: true,
            enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
        }
    }],
    readByEmployees: [{
        type: Schema.Types.ObjectId,
        ref: Role,
        //require: true
    }],
    responsibleEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    accountableEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    consultedEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    informedEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    description: {
        type: String,
        //require: true
    },
    formula: {
        type: String,
        //require: true
    },
    status: {
        type: Boolean,
        default: false,
        //require: true
    },
    numberOfUse: {
        type: Number,
        default: 0,
        //require: true
    }
}, {
    timestamps: true
});
module.exports = TaskTemplate = mongoose.model("task_templates", TaskTemplateSchema);