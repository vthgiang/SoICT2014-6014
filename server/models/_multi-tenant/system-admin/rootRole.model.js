const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const RootRoleSchema = new Schema({
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

RootRoleSchema.plugin(mongoosePaginate);

module.exports = RootRole = (db) => db.model("root_roles", RootRoleSchema);