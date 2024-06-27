const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DynamicAssignmentSchema = new Schema({
    policyId: {
        type: Schema.Types.ObjectId,
        ref: 'AuthorizationPolicy'
    },
    delegationId: {
        type: Schema.Types.ObjectId,
        ref: 'Delegation'
    },
    requesterIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Requester'
        },
    ],
    resourceIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Resource'
        },
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

DynamicAssignmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.DynamicAssignment)
        return db.model('DynamicAssignment', DynamicAssignmentSchema);
    return db.models.DynamicAssignment;
}