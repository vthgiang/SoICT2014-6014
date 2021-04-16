const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportPlanSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    transportRequirements: [{
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirement',
    }],
    transportVehicles: [{ // phuong tien van chuyen
        transportVehicle: {
            type: Schema.Types.ObjectId,
            ref: 'Asset',
            // required: true
        },
        volume: { // Thể tích thùng của xe
            type: Number,
            // required: true,
        },
        payload: { // Trọng tải của xe
            type: Number,
        },
        carriers: [{ // nguoi su dung xe nay
            carrier: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                // required: true
            }
        }]
    }],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

module.exports = (db) => {
    if (!db.models.TransportPlan)
        return db.model('TransportPlan', TransportPlanSchema);
    return db.models.TransportPlan;
} 