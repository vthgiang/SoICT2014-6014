const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarrierSchema = new Schema({ // Doccument nhân viên vận chuyển
    carrier: { // Nhân viên vận chuyển
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    transportedTime: {
        type: Number,
        required: true,
    },
    transportVehicle: {
        type: Schema.Types.ObjectId,
        ref: 'TransportVehicle',
        required: true
    },
    transportRequirements: [{ // Yeu cau van chuyen phu trach
        transportRequirement: {
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirement',
        },
        pos: {  // Vai tro: tai xe, di cung...
            type: Number,
        },
        status: { // Hoan thanh hay chua
            type: Number,
        }
    }],
});

module.exports = (db) => {
    if (!db.models.Carrier)
        return db.model('Carrier', CarrierSchema);
    return db.models.Carrier;
} 