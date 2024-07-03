const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectIssueTypeSchema = new Schema(
    { 
        name: {
            type: String
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
    },
    {
        timestamps: true,
    }
);
ProjectIssueTypeSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectIssueType) return db.model("ProjectIssueType", ProjectIssueTypeSchema);
    return db.models.ProjectIssueType;
};