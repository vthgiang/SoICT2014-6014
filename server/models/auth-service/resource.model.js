const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ResourceSchema = new Schema({
    name: {
        type: String
    },
    refId: {
        type: ObjectId,
        refPath: 'type'
    },
    type: {
        type: String,
        enum: ['Link', 'Component', 'SystemApi', 'Task'],
        require: true,
    },
    owner: {
        type: ObjectId,
        refPath: 'ownerType'
    },
    ownerType: {
        type: String,
    },
    attributes: [
        {
            attributeId: {
                type: Schema.Types.ObjectId,
                ref: 'Attribute'
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

ResourceSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Resource) return db.model('Resource', ResourceSchema);
    return db.models.Resource;
};
