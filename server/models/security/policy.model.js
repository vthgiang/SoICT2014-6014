const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PolicySchema = new Schema({
    name: { type: String, required: true },
    priority: { type: Number, required: true },
    authorizationRules: [{
        type: Schema.Types.ObjectId,
        // ref: "Rule"
    }],
    delegationRules: [{
        type: Schema.Types.ObjectId,
        // ref: "Rule"
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

PolicySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Policy)
        return db.model('Policy', PolicySchema);
    return db.models.Policy;
}
