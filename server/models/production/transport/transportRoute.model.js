const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportRouteSchema = new Schema({
    transportSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
        required: true,
    },
    transportRoute: [{
        ordinal: { // thu tu
            type: Number,
            required: true,
        },
        transportRequirement: { // yeu cau van chuyen
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirements',
            required: true,
        },

    }],
    transportVehicles: [{ // Xep nguoi, hang hoa
        transportVehicle: {
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
            required: true,
        },
        carriers: [{
            carrier: {
                type: Schema.Types.ObjectId,
                ref: 'Carrier',
                required: true, 
            },
            pos: { // Vi tri: lai xe, di cung...
                type: Number,
                required: true,
            }
        }],
        goods: [{   
            good: {
                type: Schema.Types.ObjectId,
                ref: 'Good',
                required: true
            },
            quantity: { // số lượng hàng hóa
                type: Number,
                required: true
            },
            volume: { // Thể tích khi vận tải
                type: Number,
                required: true
            }
        }],
    }]
   
});

module.exports = (db) => {
    if (!db.models.TransportRoute)
        return db.model('TransportRoute', TransportRouteSchema);
    return db.models.TransportRoute;
} 