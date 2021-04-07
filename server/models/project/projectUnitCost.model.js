const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectUnitCostSchema = new Schema(
    { 
        name: {
            type: String
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        }
    },
    {
        timestamps: true,
    }
);
ProjectUnitCostSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectUnitCost) return db.model("ProjectUnitCost", ProjectUnitCostSchema);
    return db.models.ProjectUnitCost;
};