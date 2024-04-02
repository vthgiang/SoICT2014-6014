const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng kế hoạch vận chuyển hàng trong 1 ngày
const VehicleSchema = new Schema(
    {
        name: {
            type: String
        },
        // Trọng tải xe
        tonnage: {
            type: Number
        },
        // Thể tích thùng xe
        volume: {
            type: Number
        },
        // Rộng, cao , sâu của thùng xe
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        depth: {
            type: Number
        },
        // Mức tiêu thụ nhiên liệu của xe/1km
        averageGasConsume: {
            type: Number
        },
        // Trung bình chi phí vận chuyển của xe
        averageFeeTransport: {
            type: Number
        },
        // Tốc độ tối thiểu
        minVelocity: {
            type: Number
        },
        // Tốc độ tối đa
        maxVelocity: {
            type: Number
        },
        // Loại xe
        vehicleType: {
            type: String,
            enum: ["TRUCK", "BIKE"]
        },
        // Danh sách các mặt hàng không được chở trên xe
        goodGroupsCannotTransport: [{
            type: Schema.Types.ObjectId,
            ref: "Category"
        }],
        // Chi phí cho mỗi chuyến xe
        vehicleCost: {
            type: Number
        },
        // Trạng thái của phương tiện: 1.Đang được sử dụng (khi tài xế bấm bắt đầu chuyến xe); 2. Đang không dùng
        status: {
            type: Number,
            default: 2,
        },
        requireLicense: [{
            type: String,
            enum: [
                "A2",
                "B1",
                "B2",
                "C",
                "FC",
                "FB1",
                "FB2",
            ],
        }]
    },
    {
        timestamps: true,
    }
);

VehicleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Vehicle) return db.model("Vehicle", VehicleSchema);
    return db.models.Vehicle;
};