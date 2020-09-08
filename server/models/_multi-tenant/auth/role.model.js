const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const RoleSchema = new Schema({
    name: { //Tên của role
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    parents: [{ // các roles cha. Role này sẽ có tất cả các quyền của những role cha khai báo trong mảng này
        type: Schema.Types.ObjectId,
        replies: this
    }],
    type: {
        type: Schema.Types.ObjectId,
        ref: 'role_types'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

RoleSchema.virtual('users', {
    ref: 'user_roles',
    localField: '_id',
    foreignField: 'roleId'
});

RoleSchema.virtual('links', {
    ref: 'privileges',
    localField: '_id',
    foreignField: 'roleId'
});

RoleSchema.virtual('components', {
    ref: 'privileges',
    localField: '_id',
    foreignField: 'roleId'
});

RoleSchema.plugin(mongoosePaginate);

module.exports = Role = (db) => db.model("roles", RoleSchema);