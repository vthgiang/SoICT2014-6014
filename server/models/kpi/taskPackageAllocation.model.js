const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

// Create Schema
const TaskPackageAllocationSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    durations: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    target: {
        type: Number,
    },
    unit: {
        type: String,
    },
    organizationalUnitKpi: {
        type: ObjectId,
        ref: 'OrganizationalUnitKpi',
    },
    weight: {
        type: Number,
    },
    taskTypeId: {
        type: ObjectId,
        ref: 'TaskType',
    },
    requireCertificates: [
        {
            type: ObjectId,
            ref: 'Certificate',
        },
    ],
    requireMajors: [
        {
            type: ObjectId,
            ref: 'Major',
        },
    ],
    // TODO: Add affected factor and assign resource? or exp
});

module.exports = (db) => {
    if (!db.models.TaskPackageAllocation) return db.model('TaskPackageAllocation', TaskPackageAllocationSchema);
    return db.models.TaskPackageAllocation;
};
