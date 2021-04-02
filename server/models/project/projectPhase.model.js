const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectPhaseSchema = new Schema(
    { 
        subject: {
            type: String
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        description: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);
ProjectPhaseSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectPhase) return db.model("ProjectPhase", ProjectPhaseSchema);
    return db.models.ProjectPhase;
};