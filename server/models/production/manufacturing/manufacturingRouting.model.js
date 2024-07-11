const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Bảng danh sách lỗi sản phẩm
const ManufacturingRoutingSchema = new Schema({
    code: { // Mã định tuyến
        type: String,
        required: true
    },
    name: { // Tên định tuyến
        type: String,
        required: true
    },
    manufacturingWorks: { // Nhà máy
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    },
    goods: [{ // Hàng hóa
        type: Schema.Types.ObjectId,
        ref: "Good"
    }],
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: { // Trạng thái
        type: Number,
        default: 1
    },
    description: { // Mô tả
        type: String
    },
    operations: [{ // Công đoạn
        id: {
            type: Number,
            required: true
        },
        name: { // Tên công đoạn
            type: String,
            required: true
        },
        manufacturingMill: { // Xưởng sản xuất
            type: Schema.Types.ObjectId,
            ref: "ManufacturingMill"
        },
        setupTime: { // Thời gian thiết lập
            type: Number,
            required: true
        },
        description: { // Mô tả
            type: String
        },
        resources: [{
            machine: { // Máy móc
                type: Schema.Types.ObjectId,
                ref: "Asset"
            },
            workerRole: { // Role người thực hiện
                type: Schema.Types.ObjectId,
                ref: "Role"
            },
            minExpYear: { // Số năm kinh nghiệm tối thiểu
                type: Number,
                default: 0
            },
            hourProduction: { // Sản lượng theo giờ, nếu có machine thì bằng estimatedProduction của machine đó
                type: Number,
                required: true
            },
            costPerHour: { // Chi phí vận hành máy trên giờ
                type: Number,
                default: 0
            }
        }],
        preOperation: [{ // Công đoạn trước
            type: Number,
        }],
        nextOperation: [{ // Công đoạn sau
            type: Number,
        }]
    }]

}, {
    timestamps: true,
});

ManufacturingRoutingSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingRouting)
        return db.model("ManufacturingRouting", ManufacturingRoutingSchema);
    return db.models.ManufacturingRouting;
}
