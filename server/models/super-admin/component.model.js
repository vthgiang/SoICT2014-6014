const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Company= require('../system-admin/company.model');
const Link= require('../super-admin/link.model');
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
    link: {
        type: Schema.Types.ObjectId,
        ref: Link
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
    ref: Privilege,
    localField: '_id',
    foreignField: 'resourceId'
});

ComponentSchema.plugin(mongoosePaginate);

module.exports = Component = mongoose.model("components", ComponentSchema);