const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RoleTypeSchema = new Schema({ // TODO: Hợp với role
    name: { //Tên của role
        type: String,
        required: true
    }
},{
    timestamps: true
});
module.exports = RoleType = mongoose.model("role_types", RoleTypeSchema);