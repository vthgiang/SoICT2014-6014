const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const ComponentDefaultSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: Schema.Types.ObjectId,
        ref: 'linkdefaults'
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'roledefaults'
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ComponentDefaultSchema.plugin(mongoosePaginate);

module.exports = ComponentDefault = mongoose.model("componentdefaults", ComponentDefaultSchema);