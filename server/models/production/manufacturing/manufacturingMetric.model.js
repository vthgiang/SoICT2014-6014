const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Bảng danh sách lỗi sản phẩm
const ManufacturingMetricSchema = new Schema({
    code: { // Mã metric
        type: String,
        required: true
    },
    name: { // Tên metric
        type: String,
        required: true
    }, 
    description: { // Mô tả metric
        type: String
    },
    category: { // Loại metric
        type: String,
        enum: ["efficiency", "quality", "delivery", "cost"],
        required: true
    },
    unit: { // Đơn vị metric
        type: String,
        required: true
    },
    target: { // Mục tiêu metric
        type: Number
    },
    thresholds: [{ // Ngưỡng cảnh báo
        level: { // 1: low, 2: medium, 3: high
            type: Number,
        },
        lowValue: {
            type: Number
        },
        highValue: {
            type: Number
        }
    }],
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    formula: { // Công thức tính toán metric
        type: String
    },
    alerts: [{ // Cảnh báo metric
        recordTime: {
            type: Date,
            default: Date.now
        },
        thresholdLevel: {
            type: Number,
            enum: [1, 2, 3] // Ngưỡng cảnh báo: 1. low || 2. medium || 3. high
        },
        value: {
            type: Number
        }
    }],
    failureCauses: [{ // Nguyên nhân lỗi
        type: { // Loại nguyên nhân lỗi
            type: String,
            enum: ['material', 'machine', 'manpower', 'method', 'measurement', 'enviroment']
        },
        count: { // Số lần xảy ra
            type: Number
        }
    }],
    actions: [{ // Hành động khắc phục      
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        target: {
            type: String
        },
        responsibles: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        milestones: [{
            name: {
                type: String,
                required: true
            },
            time: {
                type: Date,
                required: true
            },
            status: {
                type: Number,
                enum: [0, 1, 2], // 0. Chưa thực hiện || 1. Đang thực hiện || 2. Đã hoàn thành
                default: 0
            }
        }],
        progress: {
            type: Number,
            default: 0
        }  
    }],
    dataGrid: { // Vị trí hiển thị trên dashboard
        i: {
            type: String, 
            require: true
        },
        x: {
            type: Number,
            require: true
        },
        y: {
            type: Number,
            require: true
        },
        w: {
            type: Number,
            require: true
        },
        h: {
            type: Number,
            require: true
        }
    },
    customize: { // Tùy chỉnh style widget
        icon: {
            type: String
        },
        theme: [{
            type: String
        }]
    },
    displayName: { // Tên hiển thị trên widget
        type: String
    },
    showTarget: { // Hiển thị mục tiêu
        type: Boolean,
        default: true
    },
    showTrend: { // Hiển thị xu hướng
        type: Boolean,
        default: true
    },
    widget: { // Loại widget
        type: String,
        require: true,
        enum: ['SingleValue', 'LineChart', 'BarChart']
    }
}, {
    timestamps: true,
});

ManufacturingMetricSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingMetric)
        return db.model("ManufacturingMetric", ManufacturingMetricSchema);
    return db.models.ManufacturingMetric;
}
