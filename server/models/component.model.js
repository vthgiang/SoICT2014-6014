const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const mongoosePaginate = require('mongoose-paginate-v2');

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
        ref: Company
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ComponentSchema.virtual('roles', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'resourceId'
});

ComponentSchema.plugin(mongoosePaginate);

module.exports = Component = mongoose.model("components", ComponentSchema);