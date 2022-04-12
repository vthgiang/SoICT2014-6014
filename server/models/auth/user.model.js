const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
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
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
        status: {
            type: Number,
            required: true,
            default: 0,
        },
        deleteSoft: {
            type: Boolean,
            required: true,
            default: false,
        },
        numberDevice: {
            type: Number,
            default: 0,
        },
        tokens: [{
            type: String,
        }],
        resetPasswordToken: {
            type: String,
        },
        avatar: {
            type: String,
            default: "/upload/avatars/user.png",
        },
        pushNotificationTokens: [{ type: String }],
        // mật khẩu cấp 2
        password2: {
            type: String
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

UserSchema.virtual("roles", {
    ref: "UserRole",
    localField: "_id",
    foreignField: "userId",
});

UserSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.User) return db.model("User", UserSchema);
    return db.models.User;
};
