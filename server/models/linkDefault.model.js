const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const LinkDefaultSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String ,
        required: true,
        default: 'service'
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkDefaultSchema.virtual('roles', {
    ref: 'privileges',
    localField: '_id',
    foreignField: 'resourceId'
});

LinkDefaultSchema.plugin(mongoosePaginate);

module.exports = LinkDefault = mongoose.model("linkdefaults", LinkDefaultSchema);