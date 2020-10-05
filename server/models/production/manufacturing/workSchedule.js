const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkScheduleSchema = new Schema({

}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.WorkSchedule)
        return db.model("WorkSchedule", WorkScheduleSchema);
    return db.models.WorkSchedule;
}