const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const SystemComponent = require('./systemComponent.model');
const RootRole = require('./rootRole.model');

// Create Schema
const SystemLinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: SystemComponent
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref: RootRole
    }],
    category: {
        type: String
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemLinkSchema.plugin(mongoosePaginate);

module.exports = SystemLink = mongoose.model("system_links", SystemLinkSchema);