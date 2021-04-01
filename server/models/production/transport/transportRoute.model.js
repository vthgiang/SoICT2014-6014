const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportRouteSchema = new Schema({
    transportSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'TransportSchedule',
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
            ref: 'TransportRequirements',
            required: true,
        },
        transporters: [{
            transporter: {
                type: Schema.Types.ObjectId,
                ref: 'Transporter',
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
            volumn: { // khối lượng vận tải tương ứng
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