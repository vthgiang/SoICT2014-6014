const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Company= require('../system-admin/company.model');
const Component= require('./component.model');
const Privilege= require('../auth/privilege.model');


// Create Schema
const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: Component
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkSchema.virtual('roles', {
    ref: Privilege,
    localField: '_id',
    foreignField: 'resourceId'
});

LinkSchema.plugin(mongoosePaginate);

module.exports = Link = mongoose.model("links", LinkSchema);