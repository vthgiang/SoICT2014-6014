const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const User = require('./user.model');

// Create Schema
const RoleSchema = new Schema({
    name: { //Tên của role
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    abstract: [{ //có tất cả các quyền của những role bên trong mảng này
        type: Schema.Types.ObjectId,
        replies: this
    }]
},{
    timestamps: true
});

module.exports = Role = mongoose.model("roles", RoleSchema);