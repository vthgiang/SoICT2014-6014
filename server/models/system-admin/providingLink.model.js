const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const { ProvidingComponent, RootRole } = require('../').schema;


// Create Schema
const ProvidingLinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: ProvidingComponent
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

ProvidingLinkSchema.plugin(mongoosePaginate);

module.exports = ProvidingLink = mongoose.model("providing_links", ProvidingLinkSchema);