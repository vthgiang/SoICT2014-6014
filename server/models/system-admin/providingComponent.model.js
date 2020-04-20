const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const { ProvidingLink, RootRole } = require('../').schema;

// Create Schema
const ProvidingComponentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: ProvidingLink
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: RootRole
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ProvidingComponentSchema.plugin(mongoosePaginate);

module.exports = ProvidingComponent = mongoose.model("providing_components", ProvidingComponentSchema);