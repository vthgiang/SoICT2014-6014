const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng giải pháp giao hàng đã được tối ưu
const SolutionSchema = new Schema(
    {
        // Tổng chi phí của giải pháp
        totalCost: {
            type: Number
        },
        // Tổng chi phí cố định khi sử dụng xe, ví dụ như: chi phí mua xe, chi phí bảo hành,...
        totalVehicleCost: {
            type: Number
        },
        totalShipperCost: {
            type: Number
        },
        // Số lượng đơn hàng
        totalNumberOrders: {
            type: Number
        },
        // Tổng giá trị các đơn hàng
        totalAmount: {
            type: Number
        },
        // Tỷ lệ lấp đầy chuyến hàng của giải pháp
        VolumeRate: {
            type: Number
        },
        // Số lượng xe đã sử dụng trong giải pháp
        numberVehicle: {
            type: Number
        },
        // Tổng quãng đường các xe di chuyển
        totalDistance: {
            type: Number
        },
        // Tổng thời gian di chuyển
        totalTravelTime: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

SolutionSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Solution) return db.model("Solution", SolutionSchema);
    return db.models.Solution;
};