const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RoleTypeSchema = new Schema({
    name: { //Tên của role
        type: String,
        required: true
    }
},{
    timestamps: true
});
module.exports = RoleType = mongoose.model("role_type", RoleTypeSchema);