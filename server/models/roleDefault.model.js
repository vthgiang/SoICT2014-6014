const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const RoleDefaultSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

RoleDefaultSchema.plugin(mongoosePaginate);

module.exports = RoleDefault = mongoose.model("roledefaults", RoleDefaultSchema);