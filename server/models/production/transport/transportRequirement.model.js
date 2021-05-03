const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportRequirementSchema = new Schema({
    status: { // Trạng thái chờ phê duyệt, đã phê duyệt...
        type: Number,
        // required: true
    },
    code: {
        type: String,
        required: true,
    },
    type: { // Loại yêu cầu: giao hàng, trả hàng ....
        type: Number,
        // required: true
    },
    creator: {  // Người tạo yêu cầu
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        payload: { // khối lượng hàng hóa
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
    },
    payload: { // Khối lượng hàng hóa của cả yêu cầu vận chuyển
        type: Number,
        required: true,
    },
    volume: { // Thể tích yêu cầu của cả yêu cầu vận chuyển
        type: Number,
        required: true,
    },
    geocode: { // Tọa độ địa chỉ (phục vụ show bản đồ) kinh độ vĩ độ
        fromAddress: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
        },
        toAddress: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
        },
    },
    transportStatus: { // Trạng thái vận chuyển -  1: đã lấy được hàng, 2: chưa lấy được hàng, 3: đã giao được hàng, 4: chưa giao được hàng (đang vận chuyển)
        type: Number,
    },
    historyTransport: [{ // Trạng thái vận chuyển, trạng thái
        status: { // 1: đã lấy được hàng, 2: chưa lấy được hàng, 3: đã giao được hàng, 4: chưa giao được hàng
            type: Number,
        },
        detail: { // Lý do nếu chưa lấy, chưa giao được hàng, chi tiết thêm
            type: String,
        },
        time: {
            type: Date,
        },
        locate: { // Vị trí hiện tại người báo cáo
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            }
        },
        carrier: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
},{
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.TransportRequirement)
        return db.model('TransportRequirement', TransportRequirementSchema);
    return db.models.TransportRequirement;
} 