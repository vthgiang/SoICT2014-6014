const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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
        ref: 'system_links'
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'root_roles'
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemComponentSchema.plugin(mongoosePaginate);

module.exports = SystemComponent = mongoose.model("system_components", SystemComponentSchema);