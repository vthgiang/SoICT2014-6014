const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng quản lý chi phí vận hành của xe
const VehicleCostSchema = new Schema(
    {
        // Mã chi phí
        code: {
            type: String
        },
        // Tên chi phí
        name: {
            type: String
        },
        // Các xe có chi phí này
        vehicles: [{
            vehicle: {
                type: Schema.Types.ObjectId,
                ref: "Vehicle"
            },
            cost: {
                type: Number
            }
        }],
        // Loại chi phí: 1. Cố định, 2. Không cố định
        type: {
            type: Number
        },
    },
    {
        timestamps: true,
    }
);

VehicleCostSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.VehicleCost) return db.model("VehicleCost", VehicleCostSchema);
    return db.models.VehicleCost;
};