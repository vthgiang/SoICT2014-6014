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
    isAbstract: {
        type: Boolean,
        default: true
    },
    abstract: [{ //có tất cả các quyền của những role bên trong mảng này
        type: Schema.Types.ObjectId,
        replies: this
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

RoleSchema.virtual('users', {
    ref: 'UserRole',
    localField: '_id',
    foreignField: 'roleId'
});

RoleSchema.virtual('links', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'roleId'
});

RoleSchema.virtual('components', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'roleId'
});

module.exports = Role = mongoose.model("Role", RoleSchema);