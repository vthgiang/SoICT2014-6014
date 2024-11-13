const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const RuleSchema = new Schema({
    action: { type: String, required: true },
    entityConditions: [{
        key: String,
        value: String,
        operation: {
            type: String,
            enum: [">", "<", "=", ">=", "<=", "<>"]
        }
    }],
    objectConditions: [{
        key: String,
        value: String,
        operation: {
            type: String,
            enum: [">", "<", "=", ">=", "<=", "<>"]
        }
    }],
    conditionType: { type: String, enum: ["allow", "deny"], required: true },
    delegation: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

RuleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Rule)
        return db.model('Rule', RuleSchema);
    return db.models.Rule;
}
