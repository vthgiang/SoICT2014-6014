const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const Privilege= require('../auth/privilege.model');


// Create Schema
const ComponentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    deleteSoft: {
        type: Boolean,
        default: true
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'links'
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ComponentSchema.virtual('roles', {
    ref: Privilege,
    localField: '_id',
    foreignField: 'resourceId'
});

ComponentSchema.plugin(mongoosePaginate);

module.exports = Component = mongoose.model("components", ComponentSchema);