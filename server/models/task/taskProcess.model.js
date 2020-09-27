const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('../auth/role.model');
const Task = require('./task.model');
const ProcessTemplate = require('./processTemplate.model');
const User = require('../auth/user.model');

// Create Schema
const TaskProcessSchema = new Schema({
    processTemplate: {
        type: Schema.Types.ObjectId,
        ref: ProcessTemplate,
    },
    xmlDiagram: {
        type: String,
    },
    processName: {
        type: String
    },
    processDescription: {
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
    status: {
        type: String,
        default: "inprocess",
        required: true,
        enum: ["inprocess", "wait_for_approval", "finished", "delayed", "canceled"],
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
    viewer: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: User,
    }],
    manager: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: User,
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: Task,
    }],
    
});

module.exports = TaskProcess = mongoose.model("task_processes", TaskProcessSchema);