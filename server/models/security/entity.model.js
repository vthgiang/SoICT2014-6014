const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const EntitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: String,
    attributes: [{
        key: String,
        value: String,
        dataType: {
            type: String,
            enum: ['int', 'string']
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

EntitySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Entity)
        return db.model('Entity', EntitySchema);
    return db.models.Entity;
}
