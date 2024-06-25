const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const RequesterSchema = new Schema({
    // credentials: [{
    //     protocol: {
    //         type: String,
    //         default: "login"
    //     },
    //     token: String,
    // }],
    name: {
        type: String
    },
    refId: {
        type: ObjectId,
        refPath: 'type'
    },
    type: {
        type: String,
        enum: ['User', 'Service'],
        require: true,
    },
    attributes: [
        {
            attributeId: {
                type: Schema.Types.ObjectId,
                ref: "Attribute"
            },
            // thuộc tính của role
            value: String, //giá trị
            description: String // mô tả
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

RequesterSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Requester) return db.model("Requester", RequesterSchema);
    return db.models.Requester;
};
