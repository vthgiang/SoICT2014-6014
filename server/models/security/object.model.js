const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ObjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: String,
    attributes: [{
        key: String,
        value: String,
        operation: {
            type: String,
            enum: [">", "<", "=", ">=", "<=", "<>"]
        }
    }],
    relatedEntities: {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Entity"
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

ObjectSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Object)
        return db.model('Object', ObjectSchema);
    return db.models.Object;
}
