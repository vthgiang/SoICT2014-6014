const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('../auth/role.model')
const User = require('../auth/user.model');
const OrganizationalUnits = require('../super-admin/organizationalUnit.model')
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
        nameTask: {
          type: String
        },
        description: {
          type: String
        },
        organizationalUnit: {
          type : Schema.Types.ObjectId,
          ref: OrganizationalUnits
        },
        accountable: [{
          type: Schema.Types.ObjectId,
          ref: Role
        }],
        responsible: [{
          type: Schema.Types.ObjectId,
          ref: Role
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