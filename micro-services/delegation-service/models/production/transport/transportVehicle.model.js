const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportVehicleSchema = new Schema({ // Phương tiện vận tải (lấy từ module asset và trong kế hoạch sử dụng)
    asset: { // Tài sản cố định tương ứng
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    code: { // Mã phương tiện
        type: String,
        required: true
    },
    name: { // Tên phương tiện
        type: String,
        required: true,
    },
    usable: { // Đơn vị được sử dụng hay ko, 0 không, 1 có
        type: Number,
        required: true,
    },
    payload: { // Tải trọng xe
        type: Number,
        required: true,
    },
    volume: { // Thể tích thùng xe
        type: Number,
        required: true,
    },
    department: { // Đơn vị vận chuyển sử dụng
        type: Schema.Types.ObjectId,
        ref: 'TransportDepartment',
        required: true,
    }
});

module.exports = (db) => {
    if (!db.models || !db.models.TransportVehicle)
        return db.model('TransportVehicle', TransportVehicleSchema);
    return db.models.TransportVehicle;
}
