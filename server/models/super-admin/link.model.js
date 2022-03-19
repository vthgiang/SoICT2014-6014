const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'Component'
    }],
    attributes: [
        {
            attributeId: {
                type: Schema.Types.ObjectId,
                ref: "Attribute"
            },
            // thuộc tính của role
            name: String, // tên thuộc tính
            value: String, //giá trị
            description: String // mô tả
        },
    ],
    deleteSoft: {
        type: Boolean,
        default: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LinkSchema.virtual('roles', {
    ref: 'Privilege',
    localField: '_id',
    foreignField: 'resourceId'
});

LinkSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Link)
        return db.model('Link', LinkSchema);
    return db.models.Link;
}