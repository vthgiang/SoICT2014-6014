const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportVehicleSchema = new Schema({ // Phương tiện vận tải (lấy từ module asset và trong kế hoạch sử dụng)
    asset: { 
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    transportPlan: { // Kế hoạch có sử dụng phương tiện
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
    },
    code: { // Mã phương tiện
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
    }],
    carriers: [{ // Người vận chuyển trên xe
        pos: { // Tài xế hay người đi cùng
            type: Number,
            required: true,
        },
        carrier: { // Thông tin người vận chuyển, liên kết bảng người vận chuyển
            type: Schema.Types.ObjectId,
            ref: 'carrier',
            required: true
        }
    }],
    payload: { // Tải trọng xe
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        required: true,
    }
});

module.exports = (db) => {
    if (!db.models.TransportVehicle)
        return db.model('TransportVehicle', TransportVehicleSchema);
    return db.models.TransportVehicle;
} 