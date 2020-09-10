const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PrivilegeSchema = new Schema({
    resourceId: {
        type: Schema.Types.ObjectId,
        refPath: 'resourceType',
        required: true
    },
    resourceType: {
        type: String,
        enum: ['Link', 'TaskTemplate', 'Component', 'ProcessTemplate'],
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    },
    actions: [{
        type: String,
        enum: ['See', 'Open', 'Edit', 'Delete'],
    }]
});

module.exports = Privilege = (db) => db.model("privileges", PrivilegeSchema);