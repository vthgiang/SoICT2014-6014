const mongoose = require('mongoose');
const { generateUniqueCode } = require('../../helpers/functionHelper');
const Schema = mongoose.Schema;

const AllocationTaskAssignedSchema = new Schema(
    {
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationalUnit',
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        priority: {
            type: Number,
            default: 3,
        },
        taskTemplate: {
            type: Schema.Types.ObjectId,
            ref: 'TaskTemplate',
        },
        level: {
            type: Number,
        },
        responsibleEmployees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        requestToCloseTask: {
            requestedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
        progress: {
            type: Number,
            default: 0,
        },
        point: {
            type: Number,
            default: -1,
        },
        isAutomaticallyCreated: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.AllocationTaskAssigned) {
        return db.model('AllocationTaskAssigned', AllocationTaskAssignedSchema);
    }
    return db.models.AllocationTaskAssigned;
};
