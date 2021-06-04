const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportScheduleSchema = new Schema({
    // name: {
    //     type: String
    // },
    transportPlan: {
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
        required: true,
    },
    route: [{
        transportVehicle: { // Phương tiện vận chuyển
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
            required: true,
        },
        routeOrdinal: [{
            transportRequirement: { // Yêu cầu vận chuyển
                type: Schema.Types.ObjectId,
                ref: 'TransportRequirement',
                required: true,
            },
            type: { // Giao hay nhận hàng
                type: Number,
                required: true
            },
            distance: { // Khoảng cách với điểm trước đó km
                type: Number,
            },
            duration: { // Thời gian với điểm trước đó phút
                type: Number,
            },
        }]
    }],
    transportVehicles: [{ // Xep nguoi, hang hoa
        transportVehicle: {
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
            required: true,
        },
        transportRequirements: [{
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirement',
            required: true,
        }],        
    }]
   
});

module.exports = (db) => {
    if (!db.models.TransportSchedule)
        return db.model('TransportSchedule', TransportScheduleSchema);
    return db.models.TransportSchedule;
} 