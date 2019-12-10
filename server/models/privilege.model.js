const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('./role.model');
const Action = require('./action.model');

// Create Schema
const PrivilegeSchema = new Schema({
    resource: {
        type: Schema.Types.ObjectId,
        refPath: 'resource_type'
    },
    resource_type: {
        type: String,
        enum: ['Link', 'TaskTemplate','Component'],
    },
    role: [{
        type: Schema.Types.ObjectId,
        ref: Role
    }],
    action: { //luu id cua hanh dong tuong ung
        type: Schema.Types.ObjectId,
        ref: Action
    }
});

module.exports = Privilege = mongoose.model("privileges", PrivilegeSchema);