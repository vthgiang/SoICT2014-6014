const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ProblemAssumptionSchema = new Schema(
    {
        data: {
            type: Schema.Types.Mixed
        }
    },
    {
        timestamps: true,
    }
);

ProblemAssumptionSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ProblemAssumption) return db.model("ProblemAssumption", ProblemAssumptionSchema);
    return db.models.ProblemAssumption;
};