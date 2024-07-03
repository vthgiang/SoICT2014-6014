const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductionActivityIssueSchema = new Schema({
    manufacturingProcess: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingProcess"
    },
    productionActivity: {
        // type: Schema.Types.ObjectId,
        // ref: "ProductionActivity"
        //de tam o day
        type: String,
    },
    activityIssueName: {
        type: String,
        required: true,
    },
    activityIssueStatus: {
        type: String
    },
    activityCategoryIssue: {
        type: String
    },
    activityIssueRepaireTimer: {
        type: Number,
    },
    //xem lai truong nay co the lien ket duoc voi nguoi hay ko?
    byRepairer: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    byReporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

module.exports = (db) => {
    if (!db.models.ProductionActivityIssue) return db.model("ProductionActivityIssue", ProductionActivityIssueSchema);
    return db.models.ProductionActivityIssue;
};