const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TaskProcessSchema = new Schema({
    processTemplate: {
        type: Schema.Types.ObjectId,
        ref: 'process_templates',
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
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'tasks',
    }],
    
});

module.exports = TaskProcess = (db) => db.model("task_processes", TaskProcessSchema);