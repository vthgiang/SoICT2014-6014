const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkSchema.virtual('roles', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'resourceId'
});

LinkSchema.plugin(mongoosePaginate);

module.exports = Link = mongoose.model("links", LinkSchema);