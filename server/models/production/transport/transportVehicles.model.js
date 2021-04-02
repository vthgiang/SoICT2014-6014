const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportVehiclesSchema = new Schema({
    asset: { // Trạng thái chờ phê duyệt, đã phê duyệt...
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    useStatuses: [{ // Trang thai ngay nay co the su dung khong
        status: {
            type: Number,
            required: true,
        },
        time: {
            type: Date,
            required: true,
        }
    }]
   
});

module.exports = (db) => {
    if (!db.models.TransportVehicle)
        return db.model('TransportVehicle', TransportVehiclesSchema);
    return db.models.TransportVehicle;
} 