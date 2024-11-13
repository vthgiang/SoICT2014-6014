const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const AttributeSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['position-related', 'task-related', 'policy-related'], required: true },
    tags: [String],
    expiration: Date  // Optional, only applicable for task-related attributes
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

AttributeSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Attribute)
        return db.model('Attribute', AttributeSchema);
    return db.models.Attribute;
}