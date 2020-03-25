const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
    type: {
        type: String ,
        required: true,
        default: 'service'
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'components'
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkSchema.virtual('roles', {
    ref: 'privileges',
    localField: '_id',
    foreignField: 'resourceId'
});

LinkSchema.plugin(mongoosePaginate);

module.exports = Link = mongoose.model("links", LinkSchema);