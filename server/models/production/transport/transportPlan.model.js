const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportPlanSchema = new Schema({
    code: { // Mã kế hoạch
        type: String,
        required: true,
    },
    name: { // Tên kế hoạch
        type: String,
    },
    creator: { // Người tạo kế hoạch
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    supervisor: { // Người giám sát thực hiện kế hoạch
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: { // Trạng thái kế hoạch hiện tại 1: Cần xếp hàng, xếp lộ trình, 2: Có thể tiến hành, 3: Đang tiến hành, 4: Đã hoàn thành
        type: Number,
    },
    department: { // Đơn vị vận chuyển có kế hoạch
        type: Schema.Types.ObjectId,
        ref: 'TransportDepartment',
        required: true,
    },
    transportRequirements: [{ // Danh sách yêu cầu vận chuyển
            type: Schema.Types.ObjectId,
            ref: 'TransportRequirement',
    }],
    transportVehicles: [{ // Phân bố xe và nhân viên
        // transportVehicle: { 
        //     type: Schema.Types.ObjectId,
        //     ref: 'Asset',
        //     // required: true
        // },
        vehicle: { // Phương tiện vận chuyển
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
        carriers: [{ // Danh sách nhân viên vận chuyển điều khiển xe
            carrier: { // Nhân viên
                type: Schema.Types.ObjectId,
                ref: 'User',
                // required: true
            },
            pos: { // Vị trí: 1 là tài xế
                type: Number, 
            }
        }]
    }],
    startTime: { // Ngày bắt đầu kế hoạch vận chuyển
        type: Date,
        required: true,
    },
    endTime: { // Ngày kết thúc kế hoạch
        type: Date,
        required: true,
    },
});

module.exports = (db) => {
    if (!db.models.TransportPlan)
        return db.model('TransportPlan', TransportPlanSchema);
    return db.models.TransportPlan;
} 