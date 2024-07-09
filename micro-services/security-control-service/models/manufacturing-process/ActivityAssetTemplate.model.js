const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActivityAssetTemplateSchema = new Schema({
    assetTemplateName: {
        type: String,
        required: true,
    },
    processTemplate: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ProcessTemplate"
    },
    listTaskTemplate: [{
        taskCodeId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        timeSchedule: {
            type: Number,
            default: 0
        },
        description: {
            type: String
        },
        listAssetTask: [{
            assetId:{
                type: Schema.Types.ObjectId,
                ref: "Asset"
            },
            assetName: {
                type: String,
                required: true,
            },
            typeCate: {
                type: Schema.Types.ObjectId,
                ref: "AssetType"
            },
            quantity: {
                type: Number,
                default: 0,
            },
            unit: {
                type: String,
            }
        }],
    }],
    // Danh sách tài sản dành cho công việc sản xuất
    isTemplateAsset: {
        type: Boolean,
        default: false,
    }
})

module.exports = (db) => {
    if (!db.models.ActivityAssetTemplate) return db.model("ActivityAssetTemplate", ActivityAssetTemplateSchema);
    return db.models.ActivityAssetTemplate;
};