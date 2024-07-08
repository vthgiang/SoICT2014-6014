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
        name: {
            type: String,
            required: true
        },
        manufacturingMill: {
            type: Schema.Types.ObjectId,
            ref: "ManufacturingMill"
        },
        setupTime: {
            type: Number,
            required: true
        },
        hourProduction: {
            type: Number,
            required: true
        },
        workers: [{
            workerRole: {
                type: Schema.Types.ObjectId,
                ref: "Role"
            },  
            expYear: {
                type: Number,
            },
            number: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        machines: [{
            machine: {
                type: Schema.Types.ObjectId,
                ref: "Asset"
            },
            operatingCost: {
                type: Number,
                required: true
            },
            number: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        preOperation: [{
            type: Number,
        }],
        nextOperation: [{
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
