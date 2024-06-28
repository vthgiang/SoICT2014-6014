const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorizationAccessLogSchema = new Schema({
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: 'Requester'
    },
    resourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    },
    accessTime: {
        type: Date,
        default: Date.now
    },
    accessStatus: {
        type: String,
        enum: ['Allowed', 'Denied']
    },
    policyId: {
        type: Schema.Types.ObjectId,
        ref: 'AuthorizationPolicy'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

module.exports = (db) => {
    if (!db.models.AuthorizationAccessLog)
        return db.model('AuthorizationAccessLog', AuthorizationAccessLogSchema);
    return db.models.AuthorizationAccessLog;
}