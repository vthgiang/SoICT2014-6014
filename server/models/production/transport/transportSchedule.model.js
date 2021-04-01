const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportScheduleSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    // transportRequirements: [{
    //     transportRequirement: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'TransportRequirements',
    //         // required: true
    //     },
    //     fromAddress: {
    //         type: String,
    //         // required: true,
    //     },
    //     toAddress: {
    //         type: String,
    //         // required: true,
    //     },
    //     timeTransport: {
    //         type: String,
    //         // required: true,
    //     },
    //     totalVolumn: { // Tong khoi luong van chuyen cua yeu cau
    //         type: Number,
    //         // required: true
    //     }
    // }],
    // transportVehicles: [{ // phuong tien van chuyen
    //     transportVehicle: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'TransportVehicles',
    //         // required: true
    //     },
    //     maxVolumne: { // khoi luong van chuyen cua xe
    //         type: Number,
    //         // required: true,
    //     },
    //     transporters: [{ // nguoi su dung xe nay
    //         transporter: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'User',
    //             // required: true
    //         }
    //     }]
    // }],
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
});

module.exports = (db) => {
    if (!db.models.TransportSchedule)
        return db.model('TransportSchedule', TransportScheduleSchema);
    return db.models.TransportSchedule;
} 