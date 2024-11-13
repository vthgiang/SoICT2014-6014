const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const AuthorizationLogSchema = new Schema({
    allow: { type: String, required: true },
    type: { type: String, required: true },
    entity: { type: Schema.Types.ObjectId, ref: 'Entity', required: true},
    object: { type: Schema.Types.ObjectId, ref: 'Object', required: true},
    action: { type: String, required: true },
    policyApplied: { type: Schema.Types.ObjectId, ref: 'Policy'},
    ruleApplied: { type: Schema.Types.ObjectId, ref: 'Rule'},
    ipAddress: String,
    userAgent: String,
    location: String,
    accessTime: { type: Date, default: Date.now }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

AuthorizationLogSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.AuthorizationLog)
        return db.model('AuthorizationLog', AuthorizationLogSchema);
    return db.models.AuthorizationLog;
}
