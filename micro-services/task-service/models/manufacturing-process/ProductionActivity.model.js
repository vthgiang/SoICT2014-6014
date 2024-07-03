const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductionActivitySchema = new Schema({
    processTemplate: {
        type: Schema.Types.ObjectID,
        ref: "ProductionLine"
    },
    activityName: {
        type: String,
        required: true
    },
    activityDescription: {
        type: String,
    },
    activityTimeSchedule: {
        type: Number,
        default: 0
    },
    // Liên kết với Task.activityTask._id
    // activityTaskRef: {
    //     type: String,
    //     required: true
    // },
    activityTaskRef: {
        type: Schema.Types.ObjectID,
        ref: "ProcessTemplate.tasks",
        required: true,
    },
    // Danh sách tài sản dành cho công việc sản xuất
    listActivityAsset: [],
    // Danh sách report issue dành cho công việc sản xuất
    listActivityIssue: [],
}, { timestamps: true }
)

module.exports = (db) => {
    if (!db.models.ProductionActivity) return db.model("ProductionActivity", ProductionActivitySchema);
    return db.models.ProductionActivity;
};