const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AllocationUnitResultSchema = new Schema(
    {
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationalUnit',
        },
        // KPI
        kpiEmployee: [
            {
                assigner: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                kpis: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'EmployeeKpi',
                        required: true,
                    },
                ],
            },
        ],
        taskEmployeeIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'AllocationTaskAssigned',
                required: true,
            },
        ],
        // Task
        isAssignToEmployee: {
            type: Schema.Types.Boolean,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.AllocationUnitResult) return db.model('AllocationUnitResult', AllocationUnitResultSchema);
    return db.models.AllocationUnitResult;
};
