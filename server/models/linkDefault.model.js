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
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'roledefaults'
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkDefaultSchema.plugin(mongoosePaginate);

module.exports = LinkDefault = mongoose.model("linkdefaults", LinkDefaultSchema);