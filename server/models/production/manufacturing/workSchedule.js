const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkScheduleSchema = new Schema({
    manufacturingMill: {
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingMill'
    },
    manufacturingCommand: {
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingCommand'
    },
    usages: [{
        date: Date,
        turns: [{
            type: Schema.Types.ObjectId,
            ref: 'ManufacturingCommand'
        }]
    }],
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.WorkSchedule)
        return db.model("WorkSchedule", WorkScheduleSchema);
    return db.models.WorkSchedule;
}