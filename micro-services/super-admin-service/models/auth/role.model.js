const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Create Schema
const RoleSchema = new Schema(
    {
        name: {
            //Tên của role
            type: String,
            required: true,
        },
        parents: [
            {
                // các roles cha. Role này sẽ có tất cả các quyền của những role cha khai báo trong mảng này
                type: Schema.Types.ObjectId,
                replies: this,
            },
        ],
        type: {
            type: Schema.Types.ObjectId,
            ref: "RoleType",
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
        },
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Attribute"
                },
                // thuộc tính của role
                // name: String, // tên thuộc tính
                value: String, //giá trị
                description: String // mô tả
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

RoleSchema.virtual("users", {
    ref: "UserRole",
    localField: "_id",
    foreignField: "roleId",
});

RoleSchema.virtual("links", {
    ref: "Privilege",
    localField: "_id",
    foreignField: "roleId",
});

RoleSchema.virtual("components", {
    ref: "Privilege",
    localField: "_id",
    foreignField: "roleId",
});

RoleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models || !db.models.Role) return db.model("Role", RoleSchema);
    return db.models.Role;
};
