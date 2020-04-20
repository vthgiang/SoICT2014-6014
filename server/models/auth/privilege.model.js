const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {Role, Action} = require('../').schema;

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
    actions: [{ //luu id cua hanh dong tuong ung
        type: Schema.Types.ObjectId,
        ref: Action
    }]
});

module.exports = Privilege = mongoose.model("privileges", PrivilegeSchema);