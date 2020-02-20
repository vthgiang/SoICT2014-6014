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
    parents: [{ //có tất cả các quyền của những role bên trong mảng này
        type: Schema.Types.ObjectId,
        replies: this
    }],
    type: {
        type: Schema.Types.ObjectId,
        ref: 'role_type'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

RoleSchema.virtual('users', {
    ref: 'user_role',
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

module.exports = Role = mongoose.model("roles", RoleSchema);