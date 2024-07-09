const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng quản lý chi phí vận hành của xe
const ShipperSalarySchema = new Schema(
    {
        date: {
            type: Date
        },
        salary: [{
            shipper: {
                type: Schema.Types.ObjectId,
                ref: "Driver"
            },
            fixedSalary: {
                type: Number
            },
            bonusSalary: {
                type: Number
            },
            totalSalary: {
                type: Number
            }
        }]
    },
    {
        timestamps: true,
    }
);

ShipperSalarySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ShipperSalary) return db.model("ShipperSalary", ShipperSalarySchema);
    return db.models.ShipperSalary;
};