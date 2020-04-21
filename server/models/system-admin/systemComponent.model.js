const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const SystemLink = require('./systemLink.model');
const RootRole = require('./rootRole.model');

// Create Schema
const SystemComponentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: SystemLink
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: RootRole
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemComponentSchema.plugin(mongoosePaginate);

module.exports = SystemComponent = mongoose.model("system_components", SystemComponentSchema);