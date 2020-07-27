const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');

// Create Schema
const TaskProcessSchema = new Schema({
    xmlDiagram: {
        type: String,
    },
    taskInfo: [{
      name: {
        type: String
      },
      description: {
        type: String
      },
      accountable: [{
        type: Schema.Types.ObjectId,
        ref: User
      }],
      responsible: [{
        type: Schema.Types.ObjectId,
        ref: User
      }],
      followingTask: [{
        name: {
          type: String
        },
        description: {
          type: String
        },
        accountable: [{
          type: Schema.Types.ObjectId,
          ref: User
        }],
        responsible: [{
          type: Schema.Types.ObjectId,
          ref: User
        }],
      }]
    }]
});

module.exports = TaskHistory = mongoose.model("task_process", TaskProcessSchema);