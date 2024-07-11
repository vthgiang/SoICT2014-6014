const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng quản lý chi phí vận hành của xe
const CostFormulaSchema = new Schema(
    {
        // Công thức tính chi phí vận hành xe
        vehicle: {
            type: String
        },
        // Công thức tính lương nhân viên đội xe
        shipper: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

CostFormulaSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CostFormula) return db.model("CostFormula", CostFormulaSchema);
    return db.models.CostFormula;
};