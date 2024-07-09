const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportRequirementSchema = new Schema({
    status: { // Trạng thái kế hoạch: 0: Không được phê duyệt, 1: Chờ phê duyệt, 2: Đã phê duyệt - Chờ xếp lịch, 3: Chờ vận chuyển, 4: Đang vận chuyển, 5: Đã vận chuyển, 6: Vận chuyển thất bại
        type: Number,
        required: true
    },
    code: { // Mã kế hoạch
        type: String,
        required: true,
    },
    type: { // Loại yêu cầu: 1: Giao hàng, 2: Trả hàng, 3: Chuyển thành phẩm tới kho, 4: Giao nguyên vật liệu, 5: Vận chuyển
        type: Number,
        required: true
    },
    creator: {  // Người tạo yêu cầu
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: { // Đơn vị vận chuyển phụ trách
        type: Schema.Types.ObjectId,
        ref: 'TransportDepartment',
        required: true,
    },
    fromAddress: { // Địa điểm nhận hàng
        type: String,
        // required: true
    },
    toAddress: { // Địa điểm giao hàng
        type: String,
        // required: true
    },
    goods: [{ // Danh sách hàng hóa   
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            // required: true
        },
        quantity: { // Số lượng hàng hóa
            type: Number,
            // required: true
        },
        volume: { // Thể tích khi vận tải 
            type: Number,
            // required: true
        },
        payload: { // Khối lượng hàng hóa
            type: Number
        }
    }],
    timeRequests: [{ // Thời gian yêu cầu
        timeRequest: { // Thời gian
            type: Date,
        },
        description: { // Mô tả khác
            type: String,
        }
    }],
    transportPlan: { // Kế hoạch vận chuyển được xếp
        type: Schema.Types.ObjectId,
        ref: 'TransportPlan',
    }, 
    bill: { // Phiếu kho
        type: Schema.Types.ObjectId,
        ref: 'Bill',
    },
    detail1: { // Chi tiết nhiệm vụ ở điểm nhận hàng
        type: String,
    },
    detail2: { // Chi tiết nhiệm vụ tại điểm giao hàng
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
    geocode: { // Tọa độ địa chỉ (show bản đồ) kinh độ vĩ độ
        fromAddress: { // Điểm nhận hàng
            lat: { // Vĩ độ
                type: Number,
            },
            lng: { // Kinh độ
                type: Number,
            },
        },
        toAddress: { // Điểm giao hàng
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
            carrier: { // Người gửi xác nhận
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
    approver: { // Người phê duyệt yêu cầu vận chuyển
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    note: { // note phê duyệt
        type: String,
    },
},{
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.TransportRequirement)
        return db.model('TransportRequirement', TransportRequirementSchema);
    return db.models.TransportRequirement;
} 