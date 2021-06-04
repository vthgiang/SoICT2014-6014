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
    department: { // Phòng ban phụ trách
        type: Schema.Types.ObjectId,
        ref: 'TransportDepartment',
        required: true,
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
    detail1: { // Chi tiết nhiệm vụ ở điểm đi
        type: String,
    },
    detail2: { // Chi tiết nhiệm vụ tại điểm đến
        type: String,
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
    transportStatus: { // Trạng thái vận chuyển (khi đang thực hiện)
        fromAddress: { // Điểm lấy hàng
            status: { // Trạng thái: 1- đã lấy, 2- không lấy được hàng
                type: Number,
            },
            detail: { // Mô tả chi tiết
                type: String,
            }, 
            locate: { // Vị trí lái xe khi gửi báo cáo
                lat: { // Vĩ độ
                    type: Number,
                },
                lng: { // Kinh độ
                    type: Number,
                },
            },
            time: { // Thời gian khi gửi báo cáo
                type: Date
            },
            carrier: { // Id tài xế
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        toAddress: { // Điểm giao hàng
            status: {
                type: Number,
            },
            detail: {
                type: String,
            }, 
            locate: {
                lat: {
                    type: Number,
                },
                lng: {
                    type: Number,
                },
            },
            time: {
                type: Date
            },
            carrier: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }            
        }
    },
    approver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.TransportRequirement)
        return db.model('TransportRequirement', TransportRequirementSchema);
    return db.models.TransportRequirement;
} 