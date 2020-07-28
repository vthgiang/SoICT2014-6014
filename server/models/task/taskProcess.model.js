const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');

// Create Schema
const TaskProcessSchema = new Schema({
  xmlDiagram: {
    type: String,
  },
  nameProcess: {
    type: String
  },
  description: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  infoTask: [{
    code: {
      type: String,
    },
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