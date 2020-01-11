const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const RoleType = require('./role_type.model');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    abstract: [{ //có tất cả các quyền của những role bên trong mảng này
        type: Schema.Types.ObjectId,
        replies: this
    }],
    type: {
        type: Schema.Types.ObjectId,
        ref: RoleType
    }
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

RoleSchema.plugin(mongoosePaginate);

module.exports = Role = mongoose.model("Role", RoleSchema);