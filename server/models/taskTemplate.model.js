const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user.model');
const Department = require('./department.model');

// Model quản lý dữ liệu của một mẫu công việc
const TaskTemplateSchema = new Schema({
    unit: {
        type: Schema.Types.ObjectId,
        ref: Department,
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
    responsible: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    accounatable: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    consulted: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    informed: [{
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
module.exports = TaskTemplate = mongoose.model("tasktemplates", TaskTemplateSchema);