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
            // required: true
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
        // totalVolume: { // Tổng thể tích vận chuyển của yêu cầu
        //     type: Number,
        //     // required: true
        // },
        // totalPayload: { // Tổng khối lượng vận chuyển của yêu cầu
        //     type: Number,
        //     // required: true
        // }
    }],
    // transportVehicles: [{ // phuong tien van chuyen
    //     transportVehicle: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'TransportVehicle',
    //         // required: true
    //     },
    //     maxVolume: { // khoi luong van chuyen cua xe
    //         type: Number,
    //         // required: true,
    //     },
    //     carriers: [{ // nguoi su dung xe nay
    //         carrier: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'User',
    //             // required: true
    //         }
    //     }]
    // }],
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