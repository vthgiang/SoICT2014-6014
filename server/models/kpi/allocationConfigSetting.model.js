const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

// Create Schema
const AllocationConfigSettingSchema = new Schema(
    {
        company: {
            type: ObjectId,
            ref: 'Company',
        },
        numberGeneration: {
            type: Number,
        },
        solutionSize: {
            type: Number,
        },
        hmcr: {
            type: Number,
        },
        par: {
            type: Number,
        },
        bandwidth: {
            type: Number,
        },
        alpha: {
            type: Number,
        },
        beta: {
            type: Number,
        },
        gamma: {
            type: Number,
        },
        isAutomatically: {
            type: Boolean,
        },
        defaultSetting: {
            type: Object,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.AllocationConfigSetting) return db.model('AllocationConfigSetting', AllocationConfigSettingSchema);
    return db.models.AllocationConfigSetting;
};
