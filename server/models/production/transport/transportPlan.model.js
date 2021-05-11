const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportPlanSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    status: { // Trạng thái kế hoạch hiện tại 1: Cần xếp hàng, xếp lộ trình, 2: Có thể tiến hành, 3: Đang tiến hành, 4: Đã hoàn thành
        type: Number,
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
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: 'TransportVehicle',
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
            },
            pos: {
                type: Number, // Là lái xe => ==1 hay không
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