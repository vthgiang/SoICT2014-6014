const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductionLineSchema = new Schema({
    //Ten mau chuyen sx
    manufacturingLineName: {
        type: String,
        required: true
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
    },
    description: {
        type: String,
        required: true
    },
    approverEmployee: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],
    watcherEmployee: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],
    processTemplate: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ProcessTemplate"
    },
    totalTimeProductionLine: {
        type: Number,
        default: 0
    },
    taskList: [{
        type: Schema.Types.ObjectId,
        ref: "ProductionActivity"
    }]
})

module.exports = (db) => {
    if (!db.models.ProductionLine) return db.model("ProductionLine", ProductionLineSchema);
    return db.models.ProductionLine;
};