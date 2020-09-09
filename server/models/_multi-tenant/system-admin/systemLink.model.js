const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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
        ref: 'system_components'
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'root_roles'
    }],
    category: {
        type: String
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

SystemLinkSchema.plugin(mongoosePaginate);

module.exports = SystemLink = (db) => db.model("system_links", SystemLinkSchema);