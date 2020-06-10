const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Role = require('./role.model');
const Action = require('../super-admin/action.model');

// Create Schema
const PrivilegeSchema = new Schema({
    resourceId: {
        type: Schema.Types.ObjectId,
        refPath: 'resourceType',
        required: true
    },
    resourceType: {
        type: String,
        enum: ['Link', 'TaskTemplate', 'Component'],
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: Role,
        required: true
    },
    actions: [{
        type: String,
        enum: ['See', 'Open', 'Edit', 'Delete'],
    }]
});

module.exports = Privilege = mongoose.model("privileges", PrivilegeSchema);