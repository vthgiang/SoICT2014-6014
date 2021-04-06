const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportRequirementSchema = new Schema({
    status: { // Trạng thái chờ phê duyệt, đã phê duyệt...
        type: Number,
        // required: true
    },
    type: { // Loại yêu cầu: giao hàng, trả hàng ....
        type: Number,
        // required: true
    },
    creator: {  // Người tạo yêu cầu
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    customer: { // Khách hàng
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        // required: true
    },
    customerPhone: {
        type: String,
        // required: true
    },
    customerAddress: {
        type: String,
        // required: true
    },
    customerEmail: {
        type: String
    },
    fromAddress: { // Địa điểm xuất phát
        type: String,
        // required: true
    },
    toAddress: { // Địa điểm đích
        type: String,
        // required: true
    },
    goods: [{   
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            // required: true
        },
        quantity: { // số lượng hàng hóa
            type: Number,
            // required: true
        },
        volume: { // thể tích khi vận tải 
            type: Number,
            // required: true
        },
        weight: { // khối lượng hàng hóa
            type: Number
        }
    }],
    timeRequests: [{ // Thoi gian khach hang yeu cau
        timeRequest: {
            type: String,
        },
        description: {
            type: String,
        }
    }],
    timeTransport: { // Thoi gian van chuyen
        type: Date,
    },
    transportPlan: { // Lich van chuyen
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
    },
    transportVehicle: { // Phuong tien van chuyen
        type: Schema.Types.ObjectId,
        ref: 'TransportVehicle',
    },   
    bill: { // tuong ung phieu xuat kho
        type: Schema.Types.ObjectId,
        ref: 'Bill',
    }
});

module.exports = (db) => {
    if (!db.models.TransportRequirement)
        return db.model('TransportRequirement', TransportRequirementSchema);
    return db.models.TransportRequirement;
} 