const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportScheduleSchema = new Schema({
    // name: {
    //     type: String
    // },
    transportPlan: { // Thuộc về kế hoạch vận chuyển
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
        required: true,
    },
    route: [{ // Đường đi các phương tiện
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
    transportVehicles: [{ // Cách giao yêu cầu vận chuyển cho phương tiện
        transportVehicle: { // Phương tiện vận chuyển
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
            required: true,
        },
        transportRequirements: [{ // Yêu cầu vận chuyển phụ trách
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirement',
            required: true,
        }],
    }]

});

module.exports = (db) => {
    if (!db.models || !db.models.TransportSchedule)
        return db.model('TransportSchedule', TransportScheduleSchema);
    return db.models.TransportSchedule;
}
