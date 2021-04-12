const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportScheduleSchema = new Schema({
    transportPlan: {
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
        required: true,
    },
    route: [{
        ordinal: { // thu tu
            type: Number,
            required: true,
        },
        transportRequirement: { // yeu cau van chuyen
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirements',
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    }],
    transportVehicles: [{ // Xep nguoi, hang hoa
        transportVehicle: {
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
            required: true,
        },
        transportRequirements: [{
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirements',
            required: true,
        }],        
    }]
   
});

module.exports = (db) => {
    if (!db.models.TransportSchedule)
        return db.model('TransportSchedule', TransportScheduleSchema);
    return db.models.TransportSchedule;
} 