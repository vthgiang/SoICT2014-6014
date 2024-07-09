const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng quản lý công thức tính lương nhân viên đội xe
const ShipperCostSchema = new Schema(
    {
        // Mã chi phí
        code: {
            type: String
        },
        // Tên chi phí
        name: {
            type: String
        },
        // Số tiền
        cost: {
            type: Number
        },
        // Định mức ứng với loại chi phí này
        quota: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

ShipperCostSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ShipperCost) return db.model("ShipperCost", ShipperCostSchema);
    return db.models.ShipperCost;
};