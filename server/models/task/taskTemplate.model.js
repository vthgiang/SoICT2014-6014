const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User, OrganizationalUnit } = require('../').schema;

// Model quản lý dữ liệu của một mẫu công việc
const TaskTemplateSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    readByEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
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
        required: true
    },
    formula: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true
});
module.exports = TaskTemplate = mongoose.model("task_templates", TaskTemplateSchema);