const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ExternalPolicySchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    actions: [{
        type: String
    }],
    resources: [{
        type: String
    }],
    enabled: {
        type: Boolean
    },
    condition: {
        type: Object
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

ExternalPolicySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ExternalPolicy)
        return db.model('ExternalPolicy', ExternalPolicySchema);
    return db.models.ExternalPolicy;
}